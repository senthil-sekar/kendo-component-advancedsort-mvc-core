declare var $: any;

import { AdvancedSortController } from "./AdvancedSortController";
import { AdvancedSortEntities } from "./AdvancedSortEntities"

export class AdvancedSort {

    private controller: AdvancedSortController = null;
    private componentVariable: AdvancedSortEntities.ComponentVariable = null;

    constructor(options: any) {
        this.componentVariable = new AdvancedSortEntities.ComponentVariable(options);
        this.controller = new AdvancedSortController(this.componentVariable);
        this.onLoad();
    }

    private onLoad(): void {
        // map the available grid columns to a collection
        this.componentVariable.grid.columns.map(
            (c, ci) => {
                if (typeof c.field != "undefined" && typeof c.title != "undefined") {
                    //skip for excluded column
                    if (this.componentVariable.excludedColumn.includes(c.field, 0)) {
                        return;
                    }
                    if (c.title && c.title.trim() !== '') {
                        var colField = new AdvancedSortEntities.SortColumn({
                            columnName: c.title,
                            columnValue: c.field,
                            sortOrder: 0,
                            sortPosition: undefined
                        });
                        this.componentVariable.colFieldMap.push(colField);
                    }
                }
            }
        );

        // check and unbind click event, if attached already
        if (this.componentVariable.openPopupButton.isBoundToEvent('click')) {
            this.componentVariable.openPopupButton.unbind("click");
        }
        if (this.componentVariable.clearSortButton.isBoundToEvent('click')) {
            this.componentVariable.clearSortButton.unbind("click");
        }

        // wire button events
        this.componentVariable.openPopupButton.click(() => this.controller.openPopup());
        this.componentVariable.clearSortButton.click(() => this.controller.clearSort());
    }
}