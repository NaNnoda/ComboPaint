import ComboPaintDocument from "./Document/ComboPaintDocument";
import {DocViewer} from "./DocViewer";
import {PaintTool} from "./PaintTools/PaintTool";
import {CPLayer} from "./Layers/CPLayer";
import {NullLayer} from "./Layers/NullLayer";
import {BasicPen} from "./PaintTools/BasicPen";

export class GlobalValues {
    static _currDoc: ComboPaintDocument;
    static _allDocs: ComboPaintDocument[] = [];
    static _allDocsSet: Set<ComboPaintDocument> = new Set<ComboPaintDocument>();
    static _currTool: PaintTool;
    static _viewer: DocViewer;

    static get currDoc() {
        return GlobalValues._currDoc;
    }

    static set currDoc(doc: ComboPaintDocument) {
        GlobalValues._currDoc = doc;
        GlobalValues.viewer.viewDoc(doc);

        if (!this.allDocsSet.has(doc)) {
            this.addDoc(doc);
        }
    }

    static addDoc(doc: ComboPaintDocument) {
        GlobalValues.allDocs.push(doc);
        GlobalValues.allDocsSet.add(doc);
    }

    static removeDoc(doc: ComboPaintDocument) {
        if (!this.allDocsSet.has(doc)) {
            console.log("Doc not found");
            return;
        }
        // remove from array
        let index = GlobalValues.allDocs.indexOf(doc);
        if (index !== -1) {
            GlobalValues.allDocs.splice(index, 1);
        }

        // remove from set
        GlobalValues.allDocsSet.delete(doc);

        // remove from currDoc
        if (GlobalValues.currDoc === doc) {
            if (GlobalValues.allDocs.length > 0) {
                GlobalValues.currDoc = GlobalValues.allDocs[0];
            }
        }
    }

    static get allDocsSet() {
        return GlobalValues._allDocsSet;
    }


    static get allDocs() {
        return GlobalValues._allDocs;
    }

    static get currTool() {
        return GlobalValues._currTool;
    }

    static set currTool(tool: PaintTool) {
        GlobalValues._currTool = tool;
        tool.eventHandler = this.viewer.paintToolEventHandler;
    }

    static get viewer() {
        return GlobalValues._viewer;
    }

    static set viewer(viewer: DocViewer) {
        GlobalValues._viewer = viewer;
    }

    static get currLayer() {
        if (GlobalValues.currDoc.selectedLayer === null) {
            console.log("No layer selected");
            return NullLayer.getInstance();
            // throw new Error("Layer not set");
        }
        return GlobalValues.currDoc.selectedLayer;
    }

    static set currLayer(layer: CPLayer) {
        GlobalValues.currDoc.selectedLayer = layer;
    }

    static init(canvas: HTMLCanvasElement, doc: ComboPaintDocument | null = null, tool: PaintTool | null = null) {
        if (doc === null) {
            doc = new ComboPaintDocument(
                [3200, 1800],
                [new CPLayer(3200, 1800, "Layer 1").fill("#ffffff")]
            );
        }
        if (tool === null) {
            tool = new BasicPen();
        }

        GlobalValues.viewer = new DocViewer(canvas);

        GlobalValues.currDoc = doc;
        if (this.currDoc.selectedLayer !== null) {
            this.currLayer = this.currDoc.selectedLayer;
        }

        GlobalValues.allDocs.push(doc);
        GlobalValues.currTool = tool;

        this.currDoc.render();
        this.viewer.render();
    }
}
