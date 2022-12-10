import ComboPaintDocument from "./Document/ComboPaintDocument";
import {CPLayer} from "./Layers/CPLayer";

export class DocEditor {
    doc: ComboPaintDocument;
    constructor(doc: ComboPaintDocument) {
        this.doc = doc;
    }
}
