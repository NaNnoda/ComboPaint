import {PointerPoint} from "../Events/PointerEventHandler";
import {PaintTool} from "./PaintTool";
import {Vec2} from "../MathUtils/Vec2";

export abstract class PaintTool2D extends PaintTool {

    _imageData: ImageData | null = null;


    get ctx() {
        // if (typeof this.layer !== "CPLayer2D") {
        //     throw new Error("Layer not set");
        // }
        return this.layer.ctx as OffscreenCanvasRenderingContext2D;
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

    drawHermitCurve(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2) {
        this.ctx.beginPath();
        let cp1x = p1.x + (p2.x - p0.x) / 6;
        let cp1y = p1.y + (p2.y - p0.y) / 6;
        let cp2x = p2.x - (p3.x - p1.x) / 6;
        let cp2y = p2.y - (p3.y - p1.y) / 6;
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        this.ctx.stroke();
    }

    drawBezierCurve(startPoint:Vec2, controlPoint1:Vec2, controlPoint2:Vec2, endPoint:Vec2) {
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint.x, startPoint.y);
        this.ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        this.ctx.stroke();
    }

    drawPointDebug(p: Vec2, size: number = 20) {
        this.ctx.save();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.filter = "none";
        this.ctx.imageSmoothingEnabled = false;
        this.drawLine(p.x - size, p.y, p.x + size, p.y);
        this.drawLine(p.x, p.y - size, p.x, p.y + size);
        this.drawCircle(p.x, p.y, size);
        this.ctx.restore();

    }

    drawLineFromPoint(p1: PointerPoint, p2: PointerPoint) {
        this.drawLine(p1.x, p1.y, p2.x, p2.y);
    }

    drawCircle(x: number, y: number, radius: number) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    getRawPixel(x: number, y: number) {
        if (this._imageData === null) {
            this._imageData = this.ctx.getImageData(0, 0, this.layer.width, this.layer.height);
        }
        const index = (y * this.layer.width + x) * 4;
        return {
            r: this._imageData.data[index],
            g: this._imageData.data[index + 1],
            b: this._imageData.data[index + 2],
            a: this._imageData.data[index + 3]
        }
    }

    setPixel(x: number, y: number, r: number, g: number, b: number, a: number) {
        if (this._imageData === null) {
            this._imageData = this.ctx.getImageData(0, 0, this.layer.width, this.layer.height);
        }
        const index = (y * this.layer.width + x) * 4;
        this._imageData.data[index] = r;
        this._imageData.data[index + 1] = g;
        this._imageData.data[index + 2] = b;
        this._imageData.data[index + 3] = a;
    }

    getSafePixel(x: number, y: number, defaultPixel: any = {
        r: -1,
        g: -1,
        b: -1,
        a: -1
    }) {
        if (x < 0 || y < 0 || x >= this.layer.width || y >= this.layer.height) {
            return defaultPixel;
        }
        return this.getRawPixel(x, y);
    }

    setRawPixel(x: number, y: number, r: number, g: number, b: number, a: number) {

    }


    commitChanges() {
        this.doc.isDirty = true;
        super.commitChanges();
    }
}
