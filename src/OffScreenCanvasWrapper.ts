export class OffScreenCanvasWrapper {
    _canvas: OffscreenCanvas;
    _ctx: OffscreenRenderingContext;

    constructor(width: number, height: number, ctxId: OffscreenRenderingContextId) {
        this._canvas = new OffscreenCanvas(width, height);
        this._ctx = this._canvas.getContext(ctxId) as OffscreenRenderingContext;
        if (!this._ctx) {
            throw new Error(`Failed to get context ${ctxId}`);
        }
    }
    get width() {
        return this.canvas.width;
    }
    set width(width: number) {
        this.canvas.width = width;
    }

    get height() {
        return this.canvas.height;
    }
    set height(height: number) {
        this.canvas.height = height;
    }

    get canvas() {
        return this._canvas;
    }

    get ctx() {
        return this._ctx;
    }
}
