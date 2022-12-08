import {PaintToolEventHandler} from "../Events/PaintToolEventHandler";
import {PointerPoint} from "../Events/PointerEventHandler";
import {CPLayer} from "../Layers/CPLayer";
import ComboPaintDocument from "../ComboPaintDocument";
import {DocViewer} from "../DocViewer";

export class PaintTool {
    name: string;
    _eventHandler: PaintToolEventHandler | null = null;

    selectedLayer: CPLayer | null = null;

    _layer: CPLayer | null = null;
    _doc: ComboPaintDocument | null = null;
    _viewer: DocViewer | null = null;

    setLayer(layer: CPLayer) {
        console.debug("Setting layer to " + layer.name);
        this._layer = layer;
    }

    get layer() {
        if (this._layer === null) {
            throw new Error("Layer not set");
        }
        return this._layer;
    }

    get eventHandler() {
        if (this._eventHandler === null) {
            throw new Error("Event handler not set");
        }
        return this._eventHandler;
    }

    set eventHandler(eventHandler: PaintToolEventHandler) {
        console.log("Setting event handler");
        this._eventHandler = eventHandler;
        this._eventHandler.bind(this);
    }

    get canvas() {
        return this.layer.canvas;
    }

    get doc() {
        if (this._doc === null) {
            throw new Error("Doc not set");
        }
        return this._doc;
    }

    set doc(doc: ComboPaintDocument) {
        this._doc = doc;
    }

    get viewer() {
        if (this._viewer === null) {
            throw new Error("Viewer not set");
        }
        return this._viewer;
    }

    set viewer(viewer: DocViewer) {
        this._viewer = viewer;
    }

    constructor(eventHandler: PaintToolEventHandler | null = null, name: string | null = null) {
        if (name === null) {
            name = this.constructor.name;
        }
        this.name = name;
    }

    static createFromStandardDoc(eventHandler: PaintToolEventHandler, doc: ComboPaintDocument, viewer: DocViewer) {
        let tool = new this(eventHandler);
        tool.doc = doc;
        tool.viewer = viewer;
        tool.eventHandler = viewer.paintToolEventHandler;
        return tool;
    }

    onDown(point: PointerPoint) {
        console.log("Down");
    }

    onUp(point: PointerPoint) {
        console.log("Up");
    }

    onPressedMove(point: PointerPoint) {
        console.log("PressedMove");
    }

    onMove(point: PointerPoint) {
        console.log("Move");
    }
}
