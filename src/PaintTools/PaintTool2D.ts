import { PointerPoint} from "../Events/PointerEventHandler";
import {PaintTool} from "./PaintTool";

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
