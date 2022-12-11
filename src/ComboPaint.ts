import ComboPaintDocument from "./Document/ComboPaintDocument";
import {DocCanvasViewer} from "./DocCanvasViewer";

export default class ComboPaint {
    canvas: HTMLCanvasElement;
    div: HTMLDivElement;

    constructor(canvas: HTMLCanvasElement, div: HTMLDivElement) {
        this.canvas = canvas;
        this.div = div;
    }

    openDocument(doc: ComboPaintDocument) {

    }

    savePNG() {

    }

}
