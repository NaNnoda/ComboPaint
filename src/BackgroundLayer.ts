import {CPLayer} from "./CPLayer";

export class BackgroundLayer extends CPLayer {
    fillStyle: string;

    constructor(width: number, height: number, fillStyle: string = "white") {
        super(width, height, "Background");
        this.fillStyle = fillStyle;
    }

    drawCheckerboard(color1: string, color2: string, size: number) {
        this.ctx.fillStyle = color1;
        this.ctx.fillRect(0, 0, this.width, this.height);
        console.log(this.width);
        this.ctx.fillStyle = color2;
        for (let x = 0; x < this.width; x += size) {
            for (let y = 0; y < this.height; y += size) {
                if ((x / size) % 2 == (y / size) % 2) {
                    this.ctx.fillRect(x, y, size, size);
                }
            }
        }
    }

    render() {
        if (this.fillStyle == "checkerboard") {
            console.log("checkerboard");
            this.drawCheckerboard("#ffffff", "#cbcbcb", 10);
        } else {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

    }

}