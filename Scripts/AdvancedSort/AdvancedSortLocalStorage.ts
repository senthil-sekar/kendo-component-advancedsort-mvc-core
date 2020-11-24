import { AdvancedSortEntities } from "./AdvancedSortEntities"
import { LocalStorageHelper } from "../Shared/LocalStorageHelper"

export class AdvancedSortLocalStorage {

    private storageWorker: LocalStorageHelper.LocalStorageWorker;
    private storageKey: string;
    public sortColumns: Array<AdvancedSortEntities.SortColumn>;

    constructor(storageKey: string) {
        this.storageWorker = new LocalStorageHelper.LocalStorageWorker();
        this.storageKey = storageKey;
        this.load();
    }

    public sync(columnList: Array<AdvancedSortEntities.SortColumn>) {
        if (columnList != null) {

            const mapOld = this.mapFromArray(this.sortColumns, 'columnValue');
            const mapNew = this.mapFromArray(columnList, 'columnValue');

            for (const id in mapOld) {
                const index = this.sortColumns.indexOf(mapOld[id], 0);
                if (!mapNew.hasOwnProperty(id)) {
                    // deleted
                    if (index > -1) {
                        this.sortColumns.splice(index, 1);
                    }
                } else if (!this.isEqual(mapNew[id], mapOld[id])) {
                    // updated
                    this.sortColumns[index] = mapNew[id];
                }
            }

            for (const id in mapNew) {
                if (!mapOld.hasOwnProperty(id)) {
                    // added
                    this.sortColumns.push(mapNew[id]);
                }
            }

            this.save();
        }
    }

    public clear() {
        this.storageWorker.remove(this.storageKey);
        this.sortColumns = new Array<AdvancedSortEntities.SortColumn>();
    }

    private load() {
        this.sortColumns = new Array<AdvancedSortEntities.SortColumn>();
        var storageData = this.storageWorker.get(this.storageKey);
        if (storageData != null && storageData.length > 0) {
            var columns = JSON.parse(storageData);
            if (columns != null) {
                this.sortColumns = columns;
            }
        }
    }

    private save() {
        var jsonSortColumns = JSON.stringify(this.sortColumns);
        this.storageWorker.add(this.storageKey, jsonSortColumns);
    }

    private mapFromArray(array: Array<AdvancedSortEntities.SortColumn>, prop: string): { [index: number]: AdvancedSortEntities.SortColumn } {
        const map = {};
        for (let i = 0; i < array.length; i++) {
            map[array[i][prop]] = array[i];
        }
        return map;
    }

    private isEqual(a: AdvancedSortEntities.SortColumn, b: AdvancedSortEntities.SortColumn): boolean {
        return a.columnValue === b.columnValue
            && a.columnName === b.columnName
            && a.sortOrder === b.sortOrder
            && a.sortPosition === b.sortPosition;
    }
}
