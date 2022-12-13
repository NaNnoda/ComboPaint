import {ICanvasWrapper} from "./ICanvasWrapper";
import {CanvasWrapper} from "./CanvasWrapper";


export abstract class HTMLCanvasWrapper extends CanvasWrapper {

    // canvas: HTMLCanvasElement = document.createElement("canvas");// place the canvas in the DOM
    // private _actualCtx: CanvasRenderingContext2D | WebGLRenderingContext | null = null// place the canvas in the DOM
    // private _is2d: boolean = false;
    // private _isGl: boolean = false;


    // _isDirty: boolean = false;

    protected constructor(canvas: HTMLCanvasElement | string | null = null, ctxId: OffscreenRenderingContextId) {
        if (canvas === null) {
            canvas = document.createElement("canvas");
        }
        if (typeof canvas === "string") {
            canvas = document.getElementById(canvas) as HTMLCanvasElement;
            if (!canvas) {
                throw new Error("Failed to get canvas");
            }
        }
        super(canvas, canvas.width, canvas.height, ctxId);
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas as HTMLCanvasElement;
    }
}
