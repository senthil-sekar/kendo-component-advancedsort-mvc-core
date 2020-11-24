using Kendo.Component.AdvancedSort.Mvc.Core.Common;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.IO;

namespace Kendo.Component.AdvancedSort.Mvc.Core
{
    public static class WebResourceLoaderExtension
    {
        public static JavaScriptHtmlString LoadJavaScript(this IHtmlHelper html, string resourcePath = null)
        {
            resourcePath = string.Format("js/{0}", resourcePath);
            string fqUrl = FullyQualifiedUrl(resourcePath);
            return new JavaScriptHtmlString(fqUrl);
        }

        public static IHtmlContent LoadCss(this IHtmlHelper html, string resourcePath = null)
        {
            if (string.IsNullOrEmpty(resourcePath))
            {
                new HtmlString(AppConstant.ErrorMissingResourceName);
            }

            resourcePath = string.Format("css/{0}", resourcePath);
            var fqUrl = FullyQualifiedUrl(resourcePath);
            return new HtmlString(string.Format(@"<link rel='stylesheet' type='text/css' href='{0}'>", fqUrl));
        }

        private static string FullyQualifiedUrl(string resourcePath)
        {
            if (string.IsNullOrEmpty(resourcePath))
                return string.Empty;
            return string.Format(AppConstant.StaticFileRootPath, resourcePath);
        }
    }
}