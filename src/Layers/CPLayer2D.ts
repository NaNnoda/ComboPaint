import {CPLayer} from "./CPLayer";

export class CPLayer2D extends CPLayer {
    constructor(width: number, height: number, name: string = "New Layer") {
        super(width, height, name, "2d");
    }

    get ctx(): CanvasRenderingContext2D {
        return super.ctx as CanvasRenderingContext2D;
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
}
