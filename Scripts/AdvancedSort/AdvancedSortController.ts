declare var $: any;
declare var notifier: any;

import { AdvancedSortService } from "./AdvancedSortService";
import { AdvancedSortEntities } from "./AdvancedSortEntities";

export class AdvancedSortController {

    private componentVariable: AdvancedSortEntities.ComponentVariable = null;
    private service: AdvancedSortService = null;

    private get sortPopupWindow(): any {
        return this.componentVariable.sortPopupWindow.data("kendoWindow");
    }

    private get selectedColumnlistBox(): any {
        var control = $(this.componentVariable.selectedColumnListBoxSelector).data("kendoListBox");
        if (!control) {
            control = $(this.componentVariable.selectedColumnListBoxSelector).kendoListBox({
                "connectWith": "advanced-sort-available",
                "dataTextField": "columnName",
                "dataValueField": "columnValue",
                "dropSources": ["advanced-sort-available"],
                "template": $('#selected-sort-column-template').html(),
                "toolbar": {
                    "position": "right",
                    "tools": ["moveUp", "moveDown"]
                },
                "draggable": {
                    "enabled": true
                },
                "selectable": "single",
                "add": (e) => {
                    var listBox = $(this.componentVariable.availableColumnListBoxSelector).data("kendoListBox");
                    listBox.refresh();
                }
            }).data("kendoListBox");
        }
        return control;
    }

    private get availableColumnlistBox(): any {
        var control = $(this.componentVariable.availableColumnListBoxSelector).data("kendoListBox");
        if (!control) {
            control = $(this.componentVariable.availableColumnListBoxSelector).kendoListBox({
                "connectWith": "advanced-sort-selected",
                "dataTextField": "columnName",
                "dataValueField": "columnValue",
                "dropSources": ["advanced-sort-selected"],
                "toolbar": {
                    "position": "right",
                    "tools": ["transferTo", "transferFrom", "transferAllTo", "transferAllFrom"]
                },
                "draggable": {
                    "enabled": true
                },
                "selectable": "multiple"
            }).data("kendoListBox");
        }
        return control;
    }

    private get selectedColumnList(): Array<AdvancedSortEntities.SortColumn> {
        let stSort = new Array<AdvancedSortEntities.SortColumn>();
        if (this.selectedColumnlistBox) {
            var items = this.selectedColumnlistBox.items();
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    var dataItem = this.selectedColumnlistBox.dataItem(items[i]);
                    if (dataItem && dataItem !== '') {
                        var sortPosition = i + 1;
                        var sortOrder = this.getSortOrder(dataItem);

                        // data array for storage
                        stSort.push(new AdvancedSortEntities.SortColumn({
                            columnName: dataItem.columnName,
                            columnValue: dataItem.columnValue,
                            sortOrder: sortOrder,
                            sortPosition: sortPosition
                        }));
                    }
                }
            }
        }
        return stSort;
    }

    constructor(componentVariable: AdvancedSortEntities.ComponentVariable) {
        this.componentVariable = componentVariable;
        this.service = new AdvancedSortService(this.componentVariable);
    }

    public openPopup = () => {

        //clear all the popup content
        this.componentVariable.sortPopupWindowContent.empty();

        $.get(this.componentVariable.sortPopupUrl, {})
            .done((response) => {

                this.componentVariable.sortPopupWindowContent.html(response);
                this.componentVariable.sortPopupWindow.kendoWindow({
                    title: "Advanced Sort",
                    visible: false,
                    minWidth: "550px",
                    width: "880px",
                    minHeight: "430px",
                    maxHeight: "900px",
                    draggable: true,
                    resizable: true,
                    modal: true,
                    actions: ["Close"],
                    animation: {
                        close: {
                            duration: 1000
                        },
                        open: {
                            duration: 1000
                        }
                    }
                }).data("kendoWindow").center().open();

                this.refreshDataSource();
                this.wireEvents();

                // indicate user with message whether advanced sort is applied or not to the grid
                $("#sort-message #message").text(this.componentVariable.isAdvancedSortApplied ? 'Advanced Sort Applied' : 'Advanced Sort Not Applied');

            }).fail(() => {
                notifier.error(this.componentVariable.sortPopupUrlElement.attr('data-error')
                    , this.componentVariable.sortPopupUrlElement.attr('data-error-title'))
            });
    }

    public applySort = () => {
        if (this.selectedColumnlistBox) {
            let stSort = this.selectedColumnList;
            let dsSort = new Array();
            if (stSort.length > 0) {
                // data array for grid
                for (var i = 0; i < stSort.length; i++) {
                    dsSort.push({
                        field: stSort[i].columnValue,
                        dir: stSort[i].sortOrder > 0 ? "desc" : "asc"
                    });
                }
                this.service.syncToStorage(stSort);
                this.componentVariable.isAdvancedSortApplied = true;
            }
            else {
                this.service.removeFromStorage();
                this.componentVariable.isAdvancedSortApplied = false;
            }
            this.sortPopupWindow.close();
            this.componentVariable.grid.dataSource.sort(dsSort);
        }
    }

    public clearSort = () => {
        this.componentVariable.grid.dataSource.sort(new Array());
        this.componentVariable.isAdvancedSortApplied = false;
    }

    private wireEvents = () => {

        // popup window
        this.sortPopupWindow.setOptions({
            close: () => {
                // Important!!! Do not alter this code. 
                // Destroying the popup window on close is a fix to many bugs in muti grid scenerio
                if (this.sortPopupWindow) {
                    this.sortPopupWindow.destroy();
                }
            }
        });

        // available sort column listbox
        this.availableColumnlistBox.setOptions({
            add: (e) => {
                // hack for 'after item added' event
                e.sender.dataSource.one("change", (e) => {
                    this.toggleAction();
                });
            },
            remove: (e) => {
                // hack for 'after item removed' event
                e.sender.dataSource.one("change", (e) => {
                    this.toggleAction();
                });
            },
            reorder: (e) => {
                e.preventDefault();
            },
        });

        // double click to move column to right side
        this.availableColumnlistBox.wrapper.find(".k-list").on("dblclick", ".k-item", (e) => {
            this.availableColumnlistBox._executeCommand("transferTo");
        });

        // selected sort column listbox
        this.selectedColumnlistBox.setOptions({
            add: (e) => {
                // hack for 'after item added' event
                e.sender.dataSource.one("change", (e) => {
                    this.initSortOrderControl(e.items, true);
                    this.toggleAction();
                });
            },
            remove: (e) => {
                // hack for 'after item removed' event
                e.sender.dataSource.one("change", (e) => {
                    this.toggleAction();
                });
            },
            reorder: (e) => {
                // prevent the default event handled by kendo
                e.preventDefault();

                // handle the reorder using custom logic, since kendo's inbuilt reorder event makes the sort order button go undefined
                var dataItem = e.dataItems[0]; //since only one item can be ordered at a time, select the first item by default
                if (dataItem) {
                    var dataSource = e.sender.dataSource;
                    var sortOrder = this.getSortOrder(dataItem);

                    // compute the new index
                    var currentIndex = -1;
                    var currentItems = this.selectedColumnlistBox.items();
                    for (var i = 0; i < currentItems.length; i++) {
                        var columnName = $(currentItems[i]).text().trim();
                        if (columnName && columnName !== '') {
                            currentIndex++;
                            if (columnName === dataItem.columnName.trim()) {
                                break;
                            }
                        }
                    }
                    var newindex = currentIndex + e.offset;

                    // manually re order the item
                    dataSource.remove(dataItem);
                    dataSource.insert(newindex, dataItem);

                    //persist the current selected sort order
                    var sortOrderControl = this.getSortOrderControl(dataItem.columnValue);
                    if (sortOrderControl) {
                        sortOrderControl.select(sortOrder);
                    }

                    //persist the selected items
                    e.sender.wrapper.find("[data-uid='" + dataItem.uid + "']").addClass("k-state-selected");
                }

            },
            dataBound: (e) => {
                var items = e.sender.dataSource.data();
                this.initSortOrderControl(items, false);
                this.toggleAction();
            }
        });

        // double click to move column to left side
        this.selectedColumnlistBox.wrapper.find(".k-list").on("dblclick", ".k-item", (e) => {
            this.availableColumnlistBox._executeCommand("transferFrom");
        });

        // apply sort button
        $(this.componentVariable.applyAdvancedSortSelector).click(() => {
            this.applySort();
        });

        // reset sort button
        $(this.componentVariable.resetAdvancedSortSelector).click(() => {
            this.refreshDataSource();
        });

        // clear sort button
        $(this.componentVariable.clearAdvancedSortSelector).click(() => {
            this.availableColumnlistBox.setDataSource(this.componentVariable.colFieldMap);
            this.selectedColumnlistBox.setDataSource(new Array<AdvancedSortEntities.SortColumn>());
        });
    }

    private refreshDataSource = () => {
        this.availableColumnlistBox.setDataSource(this.service.availableColumns);
        this.selectedColumnlistBox.setDataSource(this.service.sortColumns);
    }

    private initSortOrderControl(items: any, isAdd: boolean) {
        for (var i = 0; i < items.length; i++) {
            var columnValue = items[i].columnValue;
            var sortOrder = items[i].sortOrder;
            if (columnValue) {
                var sortOrderControl = this.getSortOrderControl(columnValue);
                if (!sortOrderControl) {
                    sortOrderControl = $(this.getSortOrderControlId(columnValue))
                        .kendoButtonGroup({
                            select: (e) => {
                                this.toggleAction();
                            },
                            index: 0
                        })
                        .data("kendoButtonGroup");
                    if (sortOrderControl) {
                        sortOrderControl.select(isAdd ? 0 : sortOrder);
                    }
                }
            }
        }
    }

    private toggleAction = () => {
        var selectedItems = this.selectedColumnList;
        $("#clearAdvancedSort").prop('disabled', selectedItems.length === 0);
        $("#resetAdvancedSort").prop('disabled', this.arrayEqual(selectedItems, this.service.sortColumns));
    }

    private getSortOrder = (dataItem): number => {
        var currentSortOrder = dataItem.sortOrder
        var sortOrderControl = this.getSortOrderControl(dataItem.columnValue);
        if (sortOrderControl) {
            currentSortOrder = sortOrderControl.current().index()
        }
        return currentSortOrder;
    }

    private getSortOrderControl = (columnValue) => {
        var controlId = this.getSortOrderControlId(columnValue);
        return $(controlId).data("kendoButtonGroup");
    }

    private getSortOrderControlId = (columnValue) => {
        return "#advanced-sort-order-" + this.escapeSelector(columnValue);
    }

    private escapeSelector = (columnValue) => {
        if (columnValue) {
            return columnValue.replace(
                /([$%&()*+,./:;<=>?@\[\\\]^\{|}~])/g,
                '\\$1'
            );
        }
        return columnValue;
    }

    private arrayEqual = (a: Array<AdvancedSortEntities.SortColumn>, b: Array<AdvancedSortEntities.SortColumn>) => {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        for (var i = 0; i < a.length; ++i) {
            if (!this.isEqual(a[i], b[i])) return false;
        }
        return true;
    }

    private isEqual(a: AdvancedSortEntities.SortColumn, b: AdvancedSortEntities.SortColumn): boolean {
        return a.columnValue === b.columnValue
            && a.columnName === b.columnName
            && a.sortOrder === b.sortOrder
            && a.sortPosition === b.sortPosition;
    }
}
