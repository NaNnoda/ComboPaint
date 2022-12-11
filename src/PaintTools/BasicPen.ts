import {PaintTool2D} from "./PaintTool2D";
import {PointerPoint} from "../Events/PointerEventHandler";

export class BasicPen extends PaintTool2D {
    _fillStyle: string = "black";
    _width: number = 2;

    constructor() {
        super();
    }

    onPressedMove(point: PointerPoint) {
        super.onPressedMove(point);
        let lastPoint = this.eventHandler.lastPoint;

        if (lastPoint !== null) {
            this.setFillStyle(this._fillStyle);
            this.ctx.lineWidth = this._width;
            this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
            this.commitChanges();
        }
    }
}
