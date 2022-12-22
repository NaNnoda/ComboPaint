import JustPaintDocument from "./Documents/JustPaintDocument";
import {DocCanvasViewer} from "./UserInterfaceManagers/DocCanvasViewer";
import {PaintTool} from "./PaintTools/PaintTool";
import {nullLayer} from "./Layers/NullLayer";
import {BasicPen} from "./PaintTools/BasicPen";
import {JPLayer2D} from "./Layers/JPLayer2D";
import {GlobalEvent} from "./Events/GlobalEvent";
import {NullCanvasViewer} from "./UserInterfaceManagers/NullCanvasViewer";
import {NullDoc} from "./Documents/NullDoc";


/**
 * The main class of the JustPaint library.
 * This class is a singleton.
 */
export class JustPaint {
    _currDoc: JustPaintDocument | null = null;
    _gEvent: GlobalEvent = new GlobalEvent();
    _currTool: PaintTool | null = null;
    _viewer: DocCanvasViewer | null = null;

    _allDocs: JustPaintDocument[] = [];
    _allDocsSet: Set<JustPaintDocument> = new Set<JustPaintDocument>();

    // Singleton
    static _instance: JustPaint | null = null;
    static get instance() {
        if (JustPaint._instance === null) {
            console.log("Creating new instance of JustPaint");
            JustPaint._instance = new JustPaint();
        }
        return JustPaint._instance;
    }


    get currDoc(): JustPaintDocument {
        if (this._currDoc === null) {
            console.log("Current document is null");
            return NullDoc.instance;
        }
        return this._currDoc;
    }

    get events(): GlobalEvent {
        return this._gEvent;
    }

    set currDoc(doc: JustPaintDocument) {
        this._currDoc = doc;
        this.viewer.viewDoc(doc);

        if (!this.allDocsSet.has(doc)) {
            this.addDoc(doc);
        }
    }

    addDoc(doc: JustPaintDocument) {
        this.allDocs.push(doc);
        this.allDocsSet.add(doc);
    }

    removeDoc(doc: JustPaintDocument) {
        if (!this.allDocsSet.has(doc)) {
            console.log("Doc not found");
            return;
        }
        let index = this.allDocs.indexOf(doc);
        if (index !== -1) {
            this.allDocs.splice(index, 1);
        }

        // remove from set
        this.allDocsSet.delete(doc);

        // remove from currDoc
        if (this.currDoc === doc) {
            if (this.allDocs.length > 0) {
                this.currDoc = this.allDocs[0];
            }
        }
    }

    get allDocsSet() {
        return this._allDocsSet;
    }


    get allDocs() {
        return this._allDocs;
    }

    get currTool() {
        if (this._currTool === null) {
            console.log("Current tool is null");
            return new BasicPen();
        }
        return this._currTool;
    }

    set currTool(tool: PaintTool) {
        this._currTool = tool;
        tool.eventHandler = this.viewer.paintToolEventHandler;
    }

    get viewer() {
        if (this._viewer === null) {
            console.log("Viewer is null");
            return NullCanvasViewer.instance;
        }
        return this._viewer;
    }

    set viewer(viewer: DocCanvasViewer) {
        this._viewer = viewer;
    }

    get currLayer() {
        if (!this.currDoc) {
            console.log("No current document");
        }
        if (this.currDoc.selectedLayer === null || this.currDoc.selectedLayer === nullLayer) {
            console.log("No layer selected");
            return nullLayer;
        }
        return this.currDoc.selectedLayer;
    }

    set currLayer(layer: JPLayer2D) {
        this.currDoc.selectedLayer = layer;
    }

    init(canvas: HTMLCanvasElement, doc: JustPaintDocument | null = null, tool: PaintTool | null = null) {
        if (doc === null) {
            doc = new JustPaintDocument(
                [3200, 1800],
                [new JPLayer2D(3200, 1800, "Layer 1").fill("#ffffff")],
                "Untitled"
            );
        }
        if (tool === null) {
            tool = new BasicPen();
        }
        this.viewer = new DocCanvasViewer(canvas);
        this.currDoc = doc;
        if (this.currDoc.selectedLayer !== null) {
            this.currLayer = this.currDoc.selectedLayer;
        }
        this.currTool = tool;
        this.currDoc.render();
        this.viewer.render();
    }
}

export const justPaint = JustPaint.instance;
