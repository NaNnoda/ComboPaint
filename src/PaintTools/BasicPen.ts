import {PaintTool2D} from "./PaintTool2D";
import {PointerPoint} from "../Events/PointerEventHandler";
import {getCatmullRomSpline} from "../MathUtils/HermiteSpline";

console.log("BasicPen.ts");

export class BasicPen extends PaintTool2D {
    _color: string = "#000000";
    _maxWidth: number = 30;
    _minWidth: number = 2;
    _blur: number = 1;

    lastPoints: PointerPoint[] = [];


    onPressedMove(point: PointerPoint) {
        super.onPressedMove(point);
        let lastPoint = this.eventHandler.lastPoint;

        if (this.lastPoints.length > 0) {
            // this.setFillStyle(this._fillStyle);

            let lastFourPoints = this.getLastFourPoints();
            let p0 = lastFourPoints[0].pos;
            let p1 = lastFourPoints[1].pos;
            let p2 = lastFourPoints[2].pos;
            let p3 = lastFourPoints[3].pos;
            let widthStart = lastFourPoints[0].pressure * this._maxWidth + this._minWidth;
            let widthEnd = lastFourPoints[3].pressure * this._maxWidth + this._minWidth;

            this.ctx.save();
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.strokeStyle = this._color;
            this.ctx.lineCap = "round";
            this.ctx.filter = `blur(${this._blur}px)`;


            this.ctx.lineWidth = this._maxWidth * point.pressure + this._minWidth;

            let tolerance = 40;
            if (Math.abs(p0.x - p1.x) > tolerance || Math.abs(p0.y - p1.y) > tolerance) {
                let step = 0.25;



                for (let i = 0; i < 1; i += step) {
                    let currP = getCatmullRomSpline(p0, p1, p2, p3, i);
                    let nextP = getCatmullRomSpline(p0, p1, p2, p3, i + step);
                    this.ctx.lineWidth = widthStart * (1 - i) + widthEnd * i;
                    this.drawLine(currP.x, currP.y, nextP.x, nextP.y);
                }

                // if (true){
                //     for (let p of lastFourPoints) {
                //         this.ctx.fillStyle = "#000000";
                //         this.drawCircle(p.pos.x, p.pos.y, 10);
                //     }
                // }


            }else {
                this.drawLine(p1.x, p1.y, p2.x, p2.y);
            }



            // this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
            this.ctx.restore();
            this.commitChanges();
        }
        this.lastPoints.push(point);
    }

    onUp(point: PointerPoint) {
        super.onUp(point);
        this.commitChanges();
        this.lastPoints = [];
    }

    getLastFourPoints(): PointerPoint[] {
        let points = this.lastPoints;
        let len = points.length;
        switch (len) {
            case 0:
                return [];
            case 1:
                return [points[0], points[0], points[0], points[0]];
            case 2:
                return [points[0], points[0], points[0], points[1]];
            case 3:
                return [points[0], points[0], points[1], points[2]];
            default:
                return [points[len - 4], points[len - 3], points[len - 2], points[len - 1]];
        }
    }

    onDown(point: PointerPoint) {
        super.onUp(point);
        this.layer.needsCheckpoint = true;
        this.doc.createUndoCheckpoint();
        // this.commitChanges();
    }
}

