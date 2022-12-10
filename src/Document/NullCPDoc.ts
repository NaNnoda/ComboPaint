import ComboPaintDocument from "./ComboPaintDocument";

export class NullCPDoc extends ComboPaintDocument {
    private static _instance: NullCPDoc | null;
    static get instance() {
        if (NullCPDoc._instance === null) {
            NullCPDoc._instance = new NullCPDoc([1, 1], []);
        }
        return NullCPDoc._instance;
    }
}

export const nullCPDoc = NullCPDoc.instance;
