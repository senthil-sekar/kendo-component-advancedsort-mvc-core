using Kendo.Component.AdvancedSort.Mvc.Core.Common;
using Microsoft.AspNetCore.Mvc;

namespace Kendo.Component.AdvancedSort.Mvc.Core.Controllers
{
    public class AdvancedSortController : Controller
    {
        public IActionResult GetAdvancedSortPopup()
        {
            return PartialView(AppConstant.ViewAdvancedSortModal);
        }
    }
}
