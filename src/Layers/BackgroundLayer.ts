import {CPLayer2D} from "./CPLayer2D";

type backgroundStyle = string | CanvasGradient | CanvasPattern | "checkerboard" | "solid" | "image";

export class BackgroundLayer extends CPLayer2D {
    fillStyle: backgroundStyle;

    constructor(width: number, height: number, fillStyle: string = "checkerboard") {
        super(width, height, "Background");
        this.fillStyle = fillStyle;
        this.render();
    }

    drawCheckerboard(color1: string, color2: string, size: number) {
        this.ctx.fillStyle = color1;
        this.ctx.fillRect(0, 0, this.width, this.height);
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
            // console.log("checkerboard");
            this.drawCheckerboard("#ffffff", "#ddddde", 20);
        } else {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }
}
