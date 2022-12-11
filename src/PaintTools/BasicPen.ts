import {PaintTool2D} from "./PaintTool2D";
import {PointerPoint} from "../Events/PointerEventHandler";

export class BasicPen extends PaintTool2D {
    constructor() {
        super();
    }

    onPressedMove(point: PointerPoint) {
        super.onPressedMove(point);
        let lastPoint = this.eventHandler.lastPoint;

        if (lastPoint !== null) {
            this.setFillRGB(0, 0, 0);
            this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
            this.commitChanges();
        }
    }
}
