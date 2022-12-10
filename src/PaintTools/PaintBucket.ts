import {PaintTool2D} from "./PaintTool2D";
import {PointerPoint} from "../Events/PointerEventHandler";

export class PaintBucket extends PaintTool2D {
    constructor() {
        super();
    }

    onDown(point: PointerPoint) {
        super.onDown(point);
        this.fillArea(point, {r: 0, g: 0, b: 0, a: 255});
        this.commitChanges();
    }

    fillArea(pos: { x: number, y: number }, color: { r: number, g: number, b: number, a: number }, tolerance: number = 0) {
        let targetPixel = this.getRawPixel(pos.x, pos.y);
        let currPixel = targetPixel;


        let stack = [];
        stack.push(pos);

        while (stack.length > 0) {
            console.log("Stack length: " + stack.length);
            let {x, y} = stack.pop() as { x: number, y: number };
            currPixel = this.getSafePixel(x, y, null);
            if (currPixel !== null && this.isInRange(currPixel, targetPixel, 10)) {
                this.setPixel(x, y, color.r, color.g, color.b, color.a);
                stack.push({x: x + 1, y: y});
                stack.push({x: x - 1, y: y});
                stack.push({x: x, y: y + 1});
                stack.push({x: x, y: y - 1});
            }
        }
    }

    isInRange(pixel1: { r: number, g: number, b: number, a: number },
              pixel2: { r: number, g: number, b: number, a: number },
              tolerance: number) {
        return Math.abs(pixel1.r - pixel2.r) < tolerance
            && Math.abs(pixel1.g - pixel2.g) < tolerance
            && Math.abs(pixel1.b - pixel2.b) < tolerance
            && Math.abs(pixel1.a - pixel2.a) < tolerance;
    }
}
