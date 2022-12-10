import {OffScreenCanvasWrapper} from "./OffScreenCanvasWrapper";

export abstract class OffScreenCanvasWrapper2D extends OffScreenCanvasWrapper {
    /**
     * @param width The width of the new OffScreenCanvasWrapper2D.
     * @param height The height of the new OffScreenCanvasWrapper2D.
     * @protected This method is protected and should not be called directly.
     */
    protected constructor(width: number, height: number) {
        super(width, height, "2d");
    }

    get ctx(): OffscreenCanvasRenderingContext2D {
        return this._ctx as OffscreenCanvasRenderingContext2D;
    }

    get canvas(): OffscreenCanvas {
        return this._canvas as OffscreenCanvas;
    }

    resize(width: number, height: number, offsetX: number, offsetY: number) {
        let oldCanvas = this.canvas;
        let newCanvas = new OffscreenCanvas(width, height);
        let ctx = newCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (!ctx) {
            throw new Error("Failed to get context");
        }
        ctx.drawImage(oldCanvas, offsetX, offsetY);
        this._canvas = newCanvas;
        this._ctx = ctx;
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
