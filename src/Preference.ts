export class Preference{
    static get(key: string): any {
        return localStorage.getItem(key);
    }
    static set(key: string, value: any) {
        localStorage.setItem(key, value);
    }
}
