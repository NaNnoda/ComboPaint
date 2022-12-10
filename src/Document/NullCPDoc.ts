import ComboPaintDocument from "./ComboPaintDocument";
import {nullLayer} from "../Layers/NullLayer";

export class NullCPDoc extends ComboPaintDocument {
    private static _instance: NullCPDoc | null;
    static get instance() {
        if (NullCPDoc._instance === null) {
            NullCPDoc._instance = new NullCPDoc([1, 1], [nullLayer], "nullCPDoc");
        }
        return NullCPDoc._instance;
    }
}

export const nullCPDoc = NullCPDoc.instance;
