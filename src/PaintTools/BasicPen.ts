import {PaintTool2D} from "./PaintTool2D";
import {PointerPoint} from "../Events/PointerEventHandler";

export class BasicPen extends PaintTool2D {

    onPressedMove(point: PointerPoint) {
        super.onPressedMove(point);
        let lastPoint = this.eventHandler.lastPoint;

        if (lastPoint !== null) {
            // console.log("Drawing line from " + lastPoint.x + ", " + lastPoint.y + " to " + point.x + ", " + point.y);
            this.setFillRGB(0, 0, 0);
            this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
            this.commitChanges();
        }
    }
}
