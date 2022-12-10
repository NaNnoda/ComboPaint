import {Canvas, CanvasCtx, ICanvasWrapper} from "./ICanvasWrapper";

export abstract class CanvasWrapper implements ICanvasWrapper {
    _canvas: Canvas;
    _ctx: CanvasCtx;

    _isDirty: boolean = true;

    protected constructor(canvas: Canvas, width: number, height: number, ctxId: OffscreenRenderingContextId) {
        this._canvas = canvas;
        canvas.height = height;
        canvas.width = width;



        try {
            this._ctx = canvas.getContext(ctxId) as CanvasCtx;
        } catch (e) {
            console.log(`Id: ${ctxId} is not supported`);
            console.error(e);
        }

        this._ctx = canvas.getContext(ctxId) as CanvasCtx;
        if (this._ctx == null) {
            throw new Error("Context is null");
        }

        // this._ctx = canvas.getContext(ctxId) as OffscreenRenderingContext;
        // if (!this._ctx) {
        //     throw new Error(`Failed to get context ${ctxId}`);
        // }
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

    get isDirty(): boolean {
        return this._isDirty;
    }

    set isDirty(dirty: boolean) {
        this._isDirty = dirty;
    }

    abstract render(): void;

    abstract resize(width: number, height: number, offsetX: number, offsetY: number): void;
}
