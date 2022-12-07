import {CPLayer} from "../Layers/CPLayer";
import {PointerEventHandler} from "../Events/PointerEventHandler";
import {PaintToolEventHandler} from "../Events/PaintToolEventHandler";
import {PaintTool} from "./PaintTool";

export class PaintTool2D extends PaintTool {


    _layer: CPLayer | null = null;


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

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawCircle(x: number, y: number, radius: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
}
