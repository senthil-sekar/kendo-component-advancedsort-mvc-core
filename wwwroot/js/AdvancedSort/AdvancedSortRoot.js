// javascript way to load advanced sort into the page
$.fn.AdvancedSort = function (options) {
    var defaults = {
        gridName: '',
        excludedColumn: [],
        buttonOpenSortStyle: '',
        buttonClearSortStyle: '',
        localStorageKey: ''
    }

    $.extend(true, defaults, options);

    if (defaults.excludedColumn == null || defaults.excludedColumn == undefined) {
        defaults.excludedColumn = [];
    }

    var sortControls = `<a style="${defaults.buttonOpenSortStyle && defaults.buttonOpenSortStyle !== '' ? defaults.buttonOpenSortStyle : 'margin-left:5px'}" class="k-button-primary" title="Open Sort Popup" id="${defaults.gridName}-openpopup"><span class="k-icon k-i-sort-desc"></span></a>
                        <a style="${defaults.buttonClearSortStyle && defaults.buttonClearSortStyle !== '' ? defaults.buttonClearSortStyle : 'margin-left:5px'}" class="k-button-primary" title="Clear Sort" id="${defaults.gridName}-clearsort"><span class="k-icon k-i-sort-clear"></span></a>`;

    if ($(this)) {
        $(this).empty();
        $(this).html(sortControls);
        $(`#${defaults.gridName}`).AdvancedSortGridExtention().init(defaults);
    }
};

// Use this section to expose APIs to let client interact with the component
// Usage: $("{grid-name}").AdvancedSortGridExtention().init()
$.fn.AdvancedSortGridExtention = function () {
    var gridName = $(this).attr('id');

    function init(options) {
        var defaults = {
            gridName: gridName,
            excludedColumn: [],
            localStorageKey: ''
        }

        $.extend(true, defaults, options);

        if (defaults.excludedColumn == null || defaults.excludedColumn == undefined) {
            defaults.excludedColumn = [];
        }

        if (!$('#advanced-sort').length) {
            var popupPanel = `<div id="advanced-sort" class="display-none">
                                <div class="sort-content"></div>
                              </div>`
            $("body").append(popupPanel);
        }

        kendo.syncReady(function () {
            require(['AdvancedSort/AdvancedSortMain'], function (main) {
                new main.AdvancedSort(defaults);
            });
        });
    }

    return {
        init: init
    }
};

// Utility functions
$.fn.isBoundToEvent = function (type) {
    var events = $._data(this.get(0), "events");
    if (events) {
        var data = events[type];
        if (data !== undefined || data.length > 0) {
            return true;
        }
    }
    return false;
};