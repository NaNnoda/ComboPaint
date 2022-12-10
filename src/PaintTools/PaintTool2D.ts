import {CPLayer} from "../Layers/CPLayer";
import {PointerEventHandler, PointerPoint} from "../Events/PointerEventHandler";
import {PaintToolEventHandler} from "../Events/PaintToolEventHandler";
import {PaintTool} from "./PaintTool";

export class PaintTool2D extends PaintTool {


    get ctx() {
        if (this.layer === null) {
            throw new Error("Layer not set");
        }
        return this.layer.ctx;
    }

    setFillStyle(style: string) {
        this.ctx.fillStyle = style;
    }

    setFillRGB(r: number, g: number, b: number) {
        this.setFillStyle(`rgb(${r}, ${g}, ${b})`);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawLineFromPoint(p1: PointerPoint, p2: PointerPoint) {
        this.drawLine(p1.x, p1.y, p2.x, p2.y);
    }

    drawCircle(x: number, y: number, radius: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    commitChanges() {
        super.commitChanges();
        this.viewer.render();
    }
}
