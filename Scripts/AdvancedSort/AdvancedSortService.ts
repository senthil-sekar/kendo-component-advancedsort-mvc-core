
import { AdvancedSortEntities } from "./AdvancedSortEntities";
import { AdvancedSortLocalStorage } from "./AdvancedSortLocalStorage";

export class AdvancedSortService {

    private componentVariable: AdvancedSortEntities.ComponentVariable = null;
    private localStorage: AdvancedSortLocalStorage = null;

    constructor(componentVariable: AdvancedSortEntities.ComponentVariable) {
        this.componentVariable = componentVariable;
        this.localStorage = new AdvancedSortLocalStorage(this.componentVariable.localStorageKey);
    }

    public get sortColumns(): Array<AdvancedSortEntities.SortColumn>{
        return this.localStorage.sortColumns
            .filter(x => {
                return this.componentVariable.colFieldMap.some(y => y.columnValue === x.columnValue);
            })
            .sort((n1, n2) => {
                if (n1.sortPosition > n2.sortPosition) {
                    return 1;
                }
                if (n1.sortPosition < n2.sortPosition) {
                    return -1;
                }
                return 0;
            });
    }

    public get availableColumns(): Array<AdvancedSortEntities.SortColumn> {
        return this.componentVariable.colFieldMap.filter(x =>
            !this.localStorage.sortColumns.some(y => y.columnValue === x.columnValue)
        );
    }

    public syncToStorage(columnList: Array<AdvancedSortEntities.SortColumn>) {
        this.localStorage.sync(columnList);
    }

    public removeFromStorage() {
        this.localStorage.clear();
    }
}