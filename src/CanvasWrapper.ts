export class CanvasWrapper {
    canvas: HTMLCanvasElement = document.createElement("canvas");// place the canvas in the DOM
    private _actualCtx: CanvasRenderingContext2D | WebGLRenderingContext | null = null// place the canvas in the DOM
    private _is2d: boolean = false;
    private _isGl: boolean = false;

    constructor( canvas: HTMLCanvasElement | string | null = null, ctxId: string = "2d",) {
        this.setCanvas(canvas, ctxId);
    }

    setCanvas(canvas: HTMLCanvasElement | string | null = null, ctxId: string = "2d") {
        if (typeof canvas === "string") {
            canvas = document.getElementById(canvas) as HTMLCanvasElement;
            if (!canvas) {
                throw new Error("Failed to get canvas");
            }
        } else if (canvas === null) {
            canvas = document.createElement("canvas");
        }
        this.canvas = canvas;
        this.setCtx(ctxId);
    }

    get ctx() {
        if (this._is2d) {
            // console.log( this._actualCtx);
            return this._actualCtx as CanvasRenderingContext2D;
        }
        throw new Error("Context is not 2d");
    }
    set ctx(ctx: CanvasRenderingContext2D ) {
        console.log("You should not be setting the context");
    }

    get gl() {
        if (this._isGl) {
            return this._actualCtx as WebGLRenderingContext;
        }
        throw new Error("Context is not WebGL");
    }

    setCtx(ctxId: string) {
        this._actualCtx = this.canvas.getContext(ctxId) as CanvasRenderingContext2D | WebGLRenderingContext;
        if (this._actualCtx === null) {
            throw new Error(`Failed to get context [${ctxId}]`);
        }
        if (ctxId === "2d") {
            this._is2d = true;
        }
        if (ctxId === "webgl") {
            this._isGl = true;
        }
    }

    set width(width: number) {
        this.canvas.width = width;
    }

    set height(height: number) {
        this.canvas.height = height;
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }
}