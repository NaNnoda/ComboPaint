import {JPLayer2D} from "./JPLayer2D";

type backgroundStyle = string | CanvasGradient | CanvasPattern | "checkerboard" | "solid" | "image";

export class BackgroundLayer extends JPLayer2D {
    fillStyle: backgroundStyle;

    _color1: string = "#ffffff";
    _color2: string = "#e7e7e7";
    _checkerboardSize: number = 20;

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

    setColor1(color: string) {
        this._color1 = color;
        return this;
    }
    setColor2(color: string) {
        this._color2 = color;
        return this;
    }
    setCheckerboardSize(size: number) {
        this._checkerboardSize = size;
        return this;
    }
    setFillStyle(style: backgroundStyle) {
        this.fillStyle = style;
        return this;
    }

    render() {
        if (this.fillStyle == "checkerboard") {
            // console.log("checkerboard");
            this.drawCheckerboard(this._color1, this._color2, this._checkerboardSize);
        } else {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }
}
