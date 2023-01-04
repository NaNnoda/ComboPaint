import {DocCanvasViewer} from "./DocCanvasViewer";

export class NullCanvasViewer extends DocCanvasViewer {
    static _instance: NullCanvasViewer | null = null;

    private constructor() {
        let canvas = document.createElement("canvas");
        super(canvas);
    }

    static get instance() {
        if (NullCanvasViewer._instance === null) {
            NullCanvasViewer._instance = new NullCanvasViewer();
        }
        return NullCanvasViewer._instance;
    }
}

// export let nullCanvasViewer = NullCanvasViewer.instance;
