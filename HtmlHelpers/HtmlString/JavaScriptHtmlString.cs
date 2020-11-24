using Kendo.Component.AdvancedSort.Mvc.Core.Common;
using Microsoft.AspNetCore.Html;
using System.IO;
using System.Text.Encodings.Web;

namespace Kendo.Component.AdvancedSort.Mvc.Core
{
    public class JavaScriptHtmlString : IHtmlContent
    {
        public JavaScriptHtmlString(string path)
        {
            _path = path;
            _deferred = false;
        }

        public void WriteTo(TextWriter writer, HtmlEncoder encoder)
        {
            if (string.IsNullOrEmpty(_path))
            {
                writer.Write(AppConstant.ErrorMissingResourceName);
            }

            writer.Write(@"<script src='{0}'{1}><{2}/script>"
                , _path
                , _deferred ? " defer" : string.Empty
                , _renderAsClientTemplate ? "\\" : string.Empty);
        }

        public JavaScriptHtmlString Deferred(bool deffered)
        {
            _deferred = deffered;
            return this;
        }

        public JavaScriptHtmlString RenderAsClientTemplate(bool renderAsClientTemplate)
        {
            _renderAsClientTemplate = renderAsClientTemplate;
            return this;
        }

        private bool _deferred { get; set; }

        private bool _renderAsClientTemplate { get; set; }

        private string _path { get; set; }
    }
}