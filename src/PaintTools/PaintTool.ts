import {PaintToolEventHandler} from "../Events/PaintToolEventHandler";
import {PointerPoint} from "../Events/PointerEventHandler";
import {CPLayer} from "../Layers/CPLayer";
import ComboPaintDocument from "../Document/ComboPaintDocument";
import {DocViewer} from "../DocViewer";
import {GlobalValues} from "../GlobalValues";

export class PaintTool {
    name: string;
    _eventHandler: PaintToolEventHandler | null = null;

    // setLayer(layer: CPLayer) {
    //     console.debug("Setting layer to " + layer.name);
    //     this._layer = layer;
    // }

    get layer() {
        // if (this._layer === null) {
        //     throw new Error("Layer not set");
        // }
        // return this._layer;
        if (GlobalValues.currDoc.selectedLayer === null) {
            throw new Error("Layer not set");
        }

        return GlobalValues.currDoc.selectedLayer;
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
        if (this.layer === null) {
            throw new Error("Layer not set");
        }
        return this.layer.canvas;
    }

    get doc() {
        return GlobalValues.currDoc;
    }

    get viewer() {
        return GlobalValues.viewer;
    }

    constructor(eventHandler: PaintToolEventHandler | null = null, name: string | null = null) {
        if (name === null) {
            name = this.constructor.name;
        }
        this.name = name;
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

    commitChanges() {
        this.doc.render();
        this.viewer.render();
    }
}
