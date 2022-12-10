import ComboPaintDocument from "./Document/ComboPaintDocument";
import {Vec2} from "./MathUtils/Vec2";
import {PaintToolEventHandler} from "./Events/PaintToolEventHandler";
import {ViewerEventsHandler} from "./Events/ViewerEventsHandler";
import {BackgroundLayer} from "./Layers/BackgroundLayer";
import {GlobalValues} from "./GlobalValues";
import {CPLayer} from "./Layers/CPLayer";
import {nullLayer, NullLayer} from "./Layers/NullLayer";
import {HTMLCanvasWrapper2D} from "./CanvasWrapper/HTMLCanvasWrapper2D";

/**
 * Class that renders a ComboPaintDocument to a canvas.
 * and also handles user input.
 */
export class DocViewer extends HTMLCanvasWrapper2D {
    _state: TranslateState;

    paintToolEventHandler: PaintToolEventHandler;
    events: ViewerEventsHandler;

    background: CPLayer = NullLayer.getInstance();

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.paintToolEventHandler = new PaintToolEventHandler();
        this.events = new ViewerEventsHandler(this);

        this.setUpEventHandlers();

        this._state = new TranslateState();

        if (this.doc) {
            console.log("Doc is not null");
            console.log(this.doc);
            this.viewDoc(this.doc);
        }
    }

    viewDoc(doc: ComboPaintDocument) {
        this._state = new TranslateState();
        let offset = new Vec2(0, 0);
        let scale = 3;
        offset.x = (this.width) / 2 - doc.width / 2 * scale;
        offset.y = (this.height) / 2 - doc.height / 2 * scale;
        this.state.offset = offset;
        this.state.scale = new Vec2(scale);
        console.log("setting background");
        this.background = new BackgroundLayer(doc.width, doc.height);
    }

    setUpEventHandlers() {
        this.events.registerEvent("midDrag", (e: PointerEvent) => {
            let offset = this.state.offset;
            let lastE = this.events.lastMousePoint;
            if (lastE === null) {
                return;
            }
            let dx = e.clientX - lastE.clientX;
            let dy = e.clientY - lastE.clientY;
            // console.log({dx, dy});/**/
            this.state.offset = offset.addXY(dx, dy);
            this.render();
        });
        this.events.registerEvent("wheel", (e: WheelEvent) => {
            let isTouchPad = e.deltaMode === 1;
            // console.log(e.deltaMode);
            if (isTouchPad) {
                this.offsetCanvas(0, e.deltaY);
                this.offsetCanvas(e.deltaX, 0);
                return;
            }
            // console.log("not touchpad");
            this.zoomRelativeToMouse(1 - e.deltaY / 1000);
            // console.log(this.state.scale);
            this.render();
        });
    }

    render() {
        console.debug("Rendering");
        this.ctx.fillStyle = "#cfcfcf";
        this.ctx.fillRect(0, 0, this.width, this.height);
        // this.renderBorder();
        this.renderBackground();
        this.renderDoc();
        this.renderForeground();
    }

    get state() {
        return this._state;
    }

    get doc() {
        return GlobalValues.currDoc;
    }

    viewToDocCoords(x: number, y: number) {
        return new Vec2(
            (x - this.state.offset.x) / this.state.scale.x,
            (y - this.state.offset.y) / this.state.scale.y
        );
    }

    zoomRelativeToMouse(zoom: number) {
        if (this.events.lastPointerPoint === null) {
            return;
        }
        let x = this.events.lastPointerPoint.x;
        let y = this.events.lastPointerPoint.y;
        this.relativeZoom(x, y, zoom);
    }

    offsetCanvas(x: number, y: number) {
        this.state.offset = this.state.offset.addXY(x, y);
    }

    relativeZoom(x: number, y: number, zoom: number) {
        if (this.state.scale.x > 100) {
            if (zoom > 1) {
                return;
            }
        }
        let oldScale = this.state.scale;
        let newScale = new Vec2(oldScale.x * zoom, oldScale.y * zoom);
        let oldOffset = this.state.offset;
        let newOffset = new Vec2(
            oldOffset.x + (x - oldOffset.x) * (1 - zoom),
            oldOffset.y + (y - oldOffset.y) * (1 - zoom)
        );
        this.state.scale = newScale;
        this.state.offset = newOffset;
    }

    get mousePos() {
        return this.events.lastMousePoint;
    }

    docToViewCoords(x: number, y: number) {
        return new Vec2(
            x * this.state.scale.x + this.state.offset.x,
            y * this.state.scale.y + this.state.offset.y
        );
    }


    renderDoc() {
        this.ctx.save();
        this.ctx.translate(this.state.offset.x, this.state.offset.y);
        this.ctx.scale(this.state.scale.x, this.state.scale.y);
        // if scale is bigger than 1, don't use image smoothing
        this.ctx.imageSmoothingEnabled = !this.scaleBiggerThan(1);
        if (this.doc.isDirty) {
            this.doc.render();
        }
        this.ctx.drawImage(this.doc.canvas, 0, 0);
        this.ctx.restore();
    }

    scaleBiggerThan(n: number) {
        return this.state.scale.x > n || this.state.scale.y > n;
    }

    renderBackground() {
        // Draw background
        this.ctx.save();
        this.ctx.filter = "blur(4px)";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            this.state.offset.x,
            this.state.offset.y + 1,
            this.doc.width * this.state.scale.x,
            this.doc.height * this.state.scale.y + 1
        );
        this.ctx.restore();

        // Draw background layer
        this.ctx.save();
        this.ctx.translate(this.state.offset.x, this.state.offset.y);
        this.ctx.scale(this.state.scale.x, this.state.scale.y);
        // if scale is bigger than 1, don't use image smoothing
        this.ctx.imageSmoothingEnabled = !this.scaleBiggerThan(1)
        if (this.background == nullLayer) {
            console.log("Background is null");

        } else {
            this.ctx.drawImage(this.background.canvas, 0, 0);
        }

        this.ctx.restore();
    }

    drawScrollBars(barWidth: number, color1: string, color2: string) {
        if (this.doc.width * this.state.scale.x > this.width) {
            this.ctx.fillStyle = color1;
            this.ctx.fillRect(
                0,
                this.height - barWidth,
                this.width,
                barWidth
            );
            this.ctx.fillStyle = color2;

            let barXWidth = this.width * this.width / (this.doc.width * this.state.scale.x);
            let barXPos = -this.state.offset.x * this.width / (this.doc.width * this.state.scale.x);
            this.ctx.fillRect(
                barXPos,
                this.height - barWidth,
                barXWidth,
                barWidth
            );

        }

        if (this.doc.height * this.state.scale.y > this.height) {
            this.ctx.fillStyle = color1;
            this.ctx.fillRect(
                this.width - barWidth,
                0,
                barWidth,
                this.height
            );
            this.ctx.fillStyle = color2;

            let barYHeight = this.height * this.height / (this.doc.height * this.state.scale.y);
            let barYPos = -this.state.offset.y * this.height / (this.doc.height * this.state.scale.y);
            this.ctx.fillRect(
                this.width - barWidth,
                barYPos,
                barWidth,
                barYHeight
            );
        }
    }

    renderForeground() {
        if (this.scaleBiggerThan(9)) {
            this.ctx.save();
            // Draw a grid
            this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
            this.ctx.lineWidth = 0.5;
            let startingX = Math.max(
                this.state.offset.x % this.state.scale.x,
                this.state.offset.x
            );
            let startingY = Math.max(
                this.state.offset.y % this.state.scale.y,
                this.state.offset.y
            );

            let endX = (this.state.offset.x + this.doc.width * this.state.scale.x);
            if (endX > this.width) {
                endX = this.width;
            }
            let endY = (this.state.offset.y + this.doc.height * this.state.scale.y);
            if (endY > this.height) {
                endY = this.height;
            }

            for (let i = startingX; i < endX; i += this.state.scale.x) {
                this.ctx.beginPath();
                this.ctx.moveTo(i, startingY);
                this.ctx.lineTo(i, endY);
                this.ctx.stroke();
            }

            for (let i = startingY; i < endY; i += this.state.scale.y) {
                this.ctx.beginPath();
                this.ctx.moveTo(startingX, i);
                this.ctx.lineTo(endX, i);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }

        this.drawScrollBars(10,
            "#ffffff",
            "#a9a9a9");
    }
}

class TranslateState {
    offset: Vec2 = new Vec2(0, 0);
    scale: Vec2 = new Vec2(1, 1);
}
