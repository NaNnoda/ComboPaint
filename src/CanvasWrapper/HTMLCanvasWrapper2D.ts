import {HTMLCanvasWrapper} from "./HTMLCanvasWrapper";

export abstract class HTMLCanvasWrapper2D extends HTMLCanvasWrapper {

    protected constructor(canvas: HTMLCanvasElement | string | null = null) {
        super(canvas, "2d");
    }

    get ctx(): CanvasRenderingContext2D {
        return this._ctx as CanvasRenderingContext2D;
    }

    resize(width: number, height: number, offsetX: number, offsetY: number) {
        let oldCanvas = this.canvas;
        let newCanvas = document.createElement("canvas");
        newCanvas.width = width;
        newCanvas.height = height;
        let ctx = newCanvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(oldCanvas, offsetX, offsetY);
            this._canvas = newCanvas;
            this._ctx = ctx;
            return;
        }
        throw new Error("Failed to get context");
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        return this;
    }

    fill(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        return this;
    }

    abstract render(): void;
}
