export class Singleton {
    private static _instance: Singleton | null;
    static get instance() {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    }
}
