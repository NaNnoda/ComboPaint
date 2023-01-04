import {PaintToolEventHandler} from "../Events/PaintToolEventHandler";
import {PointerPoint} from "../Events/PointerEventHandler";
import {globalVar} from "../Global/JPGlobalVar";
// import {justPaint} from "../JustPaint";

export abstract class PaintTool {
    name: string;
    _eventHandler: PaintToolEventHandler | null = null;

    get layer() {
        if (globalVar.currDoc.selectedLayer === null) {
            throw new Error("Layer not set");
        }

        return globalVar.currDoc.selectedLayer;
    }

    get ctx() {
        return globalVar.currLayer.ctx;
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
        return globalVar.currDoc;
    }

    get viewer() {
        return globalVar.viewer;
    }

     constructor(eventHandler: PaintToolEventHandler | null = null, name: string | null = null) {
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
