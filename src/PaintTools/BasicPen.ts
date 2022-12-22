import {PaintTool2D} from "./PaintTool2D";
import {PointerPoint} from "../Events/PointerEventHandler";

console.log("BasicPen.ts");
export class BasicPen extends PaintTool2D {
    _color: string = "#000000";
    _maxWidth: number = 4;
    _minWidth: number = 0;
    _blur: number = 0.5;



    onPressedMove(point: PointerPoint) {
        super.onPressedMove(point);
        let lastPoint = this.eventHandler.lastPoint;

        if (lastPoint !== null) {
            // this.setFillStyle(this._fillStyle);
            this.ctx.save();
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.strokeStyle = this._color;
            this.ctx.lineCap = "round";
            this.ctx.filter = `blur(${this._blur}px)`;
            this.ctx.lineWidth = this._maxWidth * point.pressure + this._minWidth;
            this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
            this.ctx.restore();
            this.commitChanges();
        }
    }

    onDown(point: PointerPoint) {
        super.onUp(point);
        this.layer.needsCheckpoint = true;
        this.doc.createUndoCheckpoint();
        // this.commitChanges();
    }
}
