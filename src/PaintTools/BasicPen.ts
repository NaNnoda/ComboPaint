import {PaintTool2D} from "./PaintTool2D";
import {PointerPoint} from "../Events/PointerEventHandler";

export class BasicPen extends PaintTool2D {
    _fillStyle: string = "black";
    _maxWidth: number = 4;
    _minWidth: number = 1;
    _blur: number = 0.3;

    constructor() {
        super();
    }

    onPressedMove(point: PointerPoint) {
        super.onPressedMove(point);
        let lastPoint = this.eventHandler.lastPoint;

        if (lastPoint !== null) {
            this.setFillStyle(this._fillStyle);
            this.ctx.lineCap = "round";
            this.ctx.filter = `blur(${this._blur}px)`;
            this.ctx.lineWidth = this._maxWidth * point.pressure + this._minWidth;
            this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
            this.commitChanges();
        }
    }
}
