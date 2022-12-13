import {PaintToolEventHandler} from "../Events/PaintToolEventHandler";
import {PointerPoint} from "../Events/PointerEventHandler";
import {CPLayer} from "../Layers/CPLayer";
import ComboPaintDocument from "../Documents/ComboPaintDocument";
import {DocCanvasViewer} from "../UserInterfaceManagers/DocCanvasViewer";
import {GlobalValues} from "../GlobalValues";

export abstract class PaintTool {
    name: string;
    _eventHandler: PaintToolEventHandler | null = null;

    get layer() {
        if (GlobalValues.currDoc.selectedLayer === null) {
            throw new Error("Layer not set");
        }

        return GlobalValues.currDoc.selectedLayer;
    }

    get ctx() {
        return GlobalValues.currLayer.ctx;
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

    protected constructor(eventHandler: PaintToolEventHandler | null = null, name: string | null = null) {
        if (name === null) {
            name = this.constructor.name;
        }
        this.name = name;
    }

    onDown(point: PointerPoint) {
        console.debug("Down");
    }

    onUp(point: PointerPoint) {
        console.debug("Up");
    }

    onPressedMove(point: PointerPoint) {
        console.debug("PressedMove");
    }

    onMove(point: PointerPoint) {
        console.debug("Move");
    }

    commitChanges() {
        this.doc.render();
        this.viewer.update();
    }
}
