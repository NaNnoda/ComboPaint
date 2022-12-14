import {JPLayer} from "./JPLayer";
import {IUndoRedoObject} from "../Interfaces/IUndoRedoObject";

export class JPLayer2D extends JPLayer implements IUndoRedoObject{
    checkpoints: ImageBitmap[] = [];
    needsCheckpoint = false;

    get canvas(): OffscreenCanvas {
        return super.canvas as OffscreenCanvas;
    }


    constructor(width: number, height: number, name: string = "New Layer") {
        super(width, height, name, "2d");
    }

    redo(): void {
        throw new Error("Method not implemented.");
    }

    get ctx(): OffscreenCanvasRenderingContext2D {
        return super.ctx as OffscreenCanvasRenderingContext2D;
    }

    render(): void {
    }

    resize(width: number, height: number, offsetX: number, offsetY: number): void {
        this.ctx.drawImage(this.canvas, offsetX, offsetY);
    }

    fill(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        return this;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        return this;
    }

    createUndoCheckpoint() {
        console.log("Creating checkpoint on layer " + this.name);
        let checkpoint = this.canvas.transferToImageBitmap();
        this.checkpoints.push(checkpoint);
        this.ctx.drawImage(checkpoint, 0, 0);
        this.needsCheckpoint = false;
    }

    undo() {
        // console.log("Undoing on layer " + this.name);
        if (this.checkpoints.length > 0) {
            console.log(this.checkpoints.length);
            let checkpoint = this.checkpoints.pop() as ImageBitmap;
            this.clear();
            this.ctx.drawImage(checkpoint, 0, 0);
        }
    }

    removeFirstCheckpoint(): void {
        if (this.checkpoints.length > 0) {
            this.checkpoints.shift();
        }
    }
}
