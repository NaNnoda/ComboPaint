import {ICanvasWrapper} from "./ICanvasWrapper";
import {CanvasWrapper} from "./CanvasWrapper";

export abstract class OffScreenCanvasWrapper extends CanvasWrapper {
    _canvas: OffscreenCanvas;
    _ctx: OffscreenRenderingContext;

    protected constructor(width: number, height: number, ctxId: OffscreenRenderingContextId) {
        super(new OffscreenCanvas(width, height), width, height, ctxId);
        this._canvas = this.canvas as OffscreenCanvas;
        this._ctx = this.ctx as OffscreenRenderingContext;
    }
}
