export default class Color {
    public _r: number;
    public _g: number;
    public _b: number;
    public _a: number;

    constructor(r: number, g: number, b: number, a: number = 1) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    private static hueToRgb(p: number, q: number, t: number): number {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }

    static hexStrToHSL(str: string): [number, number, number] {
        let r: number = parseInt(str[1] + str[2], 16);
        let g: number = parseInt(str[3] + str[4], 16);
        let b: number = parseInt(str[5] + str[6], 16);

        r /= 255;
        g /= 255;
        b /= 255;

        let l = (Math.max(r, g, b));
        let s = (l - Math.min(r, g, b));
        let h = 0;
        if (s != 0) {
            if (l == r) {
                h = (g - b) / s;
            } else if (l == g) {
                h = 2 + (b - r) / s;
            } else {
                h = 4 + (r - g) / s;
            }
        }
        h *= 60;
        if (h < 0) {
            h += 360;
        }
        s *= 100;
        l *= 100;
        return [h, s, l];
    }

    static hslToHex(h: number, s: number, l: number, a: number = 1): string {
        let r: number;
        let g: number;
        let b: number;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = Color.hueToRgb(p, q, h + 1 / 3);
            g = Color.hueToRgb(p, q, h);
            b = Color.hueToRgb(p, q, h - 1 / 3);
        }

        let hexR = Math.round(r * 255).toString(16);
        let hexG = Math.round(g * 255).toString(16);
        let hexB = Math.round(b * 255).toString(16);
        let hexA = Math.round(a * 255).toString(16);

        return `#${hexR}${hexG}${hexB}${hexA}`;
    }

    public get red(): number {
        return this._r;
    }

    public set red(value: number) {
        this._r = value;
    }

    public get green(): number {
        return this._g;
    }

    public set green(value: number) {
        this._g = value;
    }

    public get blue(): number {
        return this._b;
    }

    public set blue(value: number) {
        this._b = value;
    }

    public get alpha(): number {
        return this._a;
    }

    public set a(value: number) {
        this._a = value;
    }


    public get hue() {
        return Math.atan2(Math.sqrt(3) * (this.green - this.blue), 2 * this.red - this.green - this.blue);
    }

    public get saturation() {
        return 1 - 3 * Math.min(this.red, this.green, this.blue) / (this.red + this.green + this.blue);
    }

    public get luminance(): number {
        return 0.2126 * this.red + 0.7152 * this.green + 0.0722 * this.blue;
    }


    public toString(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.a})`;
    }
}
