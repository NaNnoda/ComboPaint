import {OffScreenCanvasWrapper} from "./OffScreenCanvasWrapper";

export class OffScreenCanvasWrapper2D extends OffScreenCanvasWrapper {
    // _imageData: ImageData;
    // _data: Uint8ClampedArray;
    // _data32: Uint32Array;
    // _data8: Uint8ClampedArray;

    constructor(width: number, height: number) {
        super(width, height, "2d");
        // this._imageData = this.ctx.getImageData(0, 0, width, height);
        // this._data = this._imageData.data;
        // this._data32 = new Uint32Array(this._data.buffer);
        // this._data8 = new Uint8ClampedArray(this._data.buffer);
    }

    get ctx(): OffscreenCanvasRenderingContext2D {
        return this._ctx as OffscreenCanvasRenderingContext2D;
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        // this._imageData = this.ctx.getImageData(0, 0, width, height);
        // this._data = this._imageData.data;
        // this._data32 = new Uint32Array(this._data.buffer);
        // this._data8 = new Uint8ClampedArray(this._data.buffer);
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
}
