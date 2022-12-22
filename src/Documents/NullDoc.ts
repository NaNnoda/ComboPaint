import JustPaintDocument from "./JustPaintDocument";
import {nullLayer} from "../Layers/NullLayer";

export class NullDoc extends JustPaintDocument {
    private static _instance: NullDoc | null;
    static get instance() {
        if (NullDoc._instance === null) {
            NullDoc._instance = new NullDoc([1, 1], [nullLayer], "nullCPDoc");
        }
        return NullDoc._instance;
    }
}

export const nullCPDoc = NullDoc.instance;
