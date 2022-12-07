import {CPLayer} from "../Layers/CPLayer";
import {PointerEventHandler} from "../Events/PointerEventHandler";

export class PaintTool2D {
    name: string;

    pointerEventHandler: PointerEventHandler

    _layer: CPLayer | null = null;

    constructor(pointerEventHandler: PointerEventHandler, name: string | null = null) {
        this.pointerEventHandler = pointerEventHandler;
        if (name === null) {
            name = this.constructor.name;
        }
        this.name = name;
    }

    setLayer(layer: CPLayer) {
        this._layer = layer;
    }

    get layer() {
        if (this._layer === null) {
            throw new Error("Layer not set");
        }
        return this._layer;
    }

    get ctx() {
        return this.layer.ctx;
    }

    get canvas() {
        return this.layer.canvas;
    }


}
