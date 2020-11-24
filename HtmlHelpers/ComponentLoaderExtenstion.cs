using Kendo.Component.AdvancedSort.Mvc.Core.Common;
using Kendo.Component.AdvancedSort.Mvc.Core.Models;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Kendo.Component.AdvancedSort.Mvc.Core
{
    public static class ComponentLoaderExtenstion
    {
        #region Advanced Sort

        public static IHtmlContent AdvancedSortFor(this IHtmlHelper html
            , string gridName
            , object attributes = null
            , List<string> excludedColumn = null)
        {
            if (string.IsNullOrEmpty(gridName))
                new HtmlString(AppConstant.ErrorMissingGridName);

            var model = new GridComponentConfigModel
            {
                GridName = gridName,
                ExcludedColumn = excludedColumn ?? new List<string>(),
                UseDefaultSortIconStyle = false,
                PreventAutoInitialize = false,
                RenderAsClientTemplate = false,
                LocalStorageKey = string.Empty
            };

            // bind attributes
            if (attributes != null)
            {
                model.ButtonOpenSortStyle = Convert.ToString(attributes.GetType()?.GetProperty("ButtonOpenSortStyle")?.GetValue(attributes));
                model.ButtonClearSortStyle = Convert.ToString(attributes.GetType()?.GetProperty("ButtonClearSortStyle")?.GetValue(attributes));
                model.UseDefaultSortIconStyle = Convert.ToBoolean(attributes.GetType()?.GetProperty("UseDefaultSortIconStyle")?.GetValue(attributes));
                model.PreventAutoInitialize = Convert.ToBoolean(attributes.GetType()?.GetProperty("PreventAutoInitialize")?.GetValue(attributes));
                model.RenderAsClientTemplate = Convert.ToBoolean(attributes.GetType()?.GetProperty("RenderAsClientTemplate")?.GetValue(attributes));
                model.LocalStorageKey = Convert.ToString(attributes.GetType()?.GetProperty("LocalStorageKey")?.GetValue(attributes));
            }

            return html.Partial(AppConstant.ViewAdvancedSortToolStrip, model);
        }

        public static IHtmlContent AdvancedSortInvokeScript(this IHtmlHelper html, GridComponentConfigModel model)
        {
            var initCode = string.Format("<script type='text/javascript'>"
                    + "$('{0}#" + model.GridName + "').AdvancedSortGridExtention().init({1});"
                    + "<{0}/script >", model.RenderAsClientTemplate ? "\\" : string.Empty, JsonConvert.SerializeObject(model));
            return new HtmlString(initCode);
        }

        public static IHtmlContent AdvancedSortSharedResource(this IHtmlHelper html, object attributes = null)
        {
            // assing a flag, so we can use this to avoid printing common resources more than once
            // this is needed to support sort component in mutiple grids in the same page
            SetFlagToHttpContext(AppConstant.AdvancedSortSharedResourceKey, html.ViewContext.HttpContext);

            var model = new GridComponentConfigModel
            {
                UseDefaultSortIconStyle = false,
                RenderAsClientTemplate = false,
                GridName = string.Empty
            };

            // bind attributes
            if (attributes != null)
            {
                model.UseDefaultSortIconStyle = Convert.ToBoolean(attributes.GetType()?.GetProperty("UseDefaultSortIconStyle")?.GetValue(attributes));
                model.RenderAsClientTemplate = Convert.ToBoolean(attributes.GetType()?.GetProperty("RenderAsClientTemplate")?.GetValue(attributes));
                model.GridName = Convert.ToString(attributes.GetType()?.GetProperty("GridName")?.GetValue(attributes));
            }

            return html.Partial(AppConstant.ViewAdvancedSortSharedResource, model);
        }

        #endregion Advanced Sort

        private static void SetFlagToHttpContext(object key, HttpContext httpContext)
        {
            if (!httpContext.Items.ContainsKey(key))
            {
                httpContext.Items.Add(key, true);
            }
            else
            {
                httpContext.Items[key] = false;
            }
        }
    }
}
