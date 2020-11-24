export module LocalStorageHelper {

    export interface IStorageItem {
        key: string;
        value: any;
    }

    export class StorageItem {
        key: string;
        value: any;

        constructor(data: IStorageItem) {
            this.key = data.key;
            this.value = data.value;
        }
    }

    export class LocalStorageWorker {
        localStorageSupported: boolean;

        constructor() {
            this.localStorageSupported = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
        }

        // add item to storage
        add(key: string, item: string) {
            if (this.localStorageSupported) {
                localStorage.setItem(key, item);
            }
        }

        // get item by key from storage
        get(key: string): string {
            if (this.localStorageSupported) {
                var item = localStorage.getItem(key);
                return item;
            } else {
                return null;
            }
        }

        // get all items from storage
        getAllItems(): Array<StorageItem> {
            var list = new Array<StorageItem>();

            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var value = localStorage.getItem(key);

                list.push(new StorageItem({
                    key: key,
                    value: value
                }));
            }

            return list;
        }

        // remove item from storage
        remove(key: string) {
            if (this.localStorageSupported) {
                localStorage.removeItem(key);
            }
        }
    }
}