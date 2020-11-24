using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Kendo.Component.AdvancedSort.Mvc.Core.Models
{
    public class GridComponentConfigModel
    {
        [Required(ErrorMessage = "GridName is required")]
        public string GridName { get; set; }

        public List<string> ExcludedColumn { get; set; }

        public string ButtonOpenSortStyle { get; set; }

        public string ButtonClearSortStyle { get; set; }

        public bool UseDefaultSortIconStyle { get; set; }

        public bool PreventAutoInitialize { get; set; }

        public bool RenderAsClientTemplate { get; set; }

        public string LocalStorageKey { get; set; }
    }
}
