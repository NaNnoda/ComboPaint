export type preferenceKey = "maxUndo"

export class Preference {
    private static _instance: Preference | null;
    static get instance() {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    }

    get(key: string): any {
        return localStorage.getItem(key);
    }

    set(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    get maxUndo(): number {
        if (this.get("maxUndo") === null) {
            this.set("maxUndo", 10);
        }
        return parseInt(this.get("maxUndo"));
    }
}
