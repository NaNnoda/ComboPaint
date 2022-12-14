import JustPaintDocument from "../Documents/JustPaintDocument";
import {nullLayer} from "./NullLayer";


export class NullDoc extends JustPaintDocument {
    private static _instance: NullDoc | null;
    static get instance() {
        if (NullDoc._instance === null) {
            NullDoc._instance = new NullDoc([1, 1], [nullLayer], "nullCPDoc");
        }
        return NullDoc._instance;
    }
}
//
// export const nullCPDoc = NullDoc.instance;
