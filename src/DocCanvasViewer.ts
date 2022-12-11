import ComboPaintDocument from "./Document/ComboPaintDocument";
import {Vec2} from "./MathUtils/Vec2";
import {PaintToolEventHandler} from "./Events/PaintToolEventHandler";
import {ViewerEventsHandler} from "./Events/ViewerEventsHandler";
import {BackgroundLayer} from "./Layers/BackgroundLayer";
import {GlobalValues} from "./GlobalValues";
import {CPLayer} from "./Layers/CPLayer";
import {nullLayer, NullLayer} from "./Layers/NullLayer";
import {HTMLCanvasWrapper2D} from "./CanvasWrapper/HTMLCanvasWrapper2D";
import {SmoothNumber} from "./SmoothNumber";

/**
 * Class that renders a ComboPaintDocument to a canvas.
 * and also handles user input.
 */
export class DocCanvasViewer extends HTMLCanvasWrapper2D {
    _state: ViewerState;

    paintToolEventHandler: PaintToolEventHandler;
    events: ViewerEventsHandler;

    background: CPLayer = NullLayer.getInstance();

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.paintToolEventHandler = new PaintToolEventHandler();
        this.events = new ViewerEventsHandler(this);

        this.setUpEventHandlers();

        this._state = new ViewerState();

        if (this.doc) {
            console.log("Doc is not null");
            console.log(this.doc);
            this.viewDoc(this.doc);
        }
    }

    viewDoc(doc: ComboPaintDocument) {
        this._state = new ViewerState();
        let offset = new Vec2(0, 0);
        let scale = 3;
        offset.x = (this.width) / 2 - doc.width / 2 * scale;
        offset.y = (this.height) / 2 - doc.height / 2 * scale;
        this.state.docOffset = offset;
        this.state.docScale = scale;
        this.state._docScaleTarget = scale;
        console.log("setting background");
        this.background = new BackgroundLayer(doc.width, doc.height);
    }

    setUpEventHandlers() {
        this.events.registerEvent("midDrag", (e: PointerEvent) => {
            let offset = this.state.docOffset;
            let lastE = this.events.lastMousePoint;
            if (lastE === null) {
                return;
            }
            let dx = e.clientX - lastE.clientX;
            let dy = e.clientY - lastE.clientY;
            // console.log({dx, dy});/**/
            this.state.docOffset = offset.addXY(dx, dy);
            this.update();
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
            this.update();
        });
    }

    render() {
        // console.log("rendering");

        if (!this.isDirty) {
            console.log("not dirty");
            return;
        }

        console.debug("Rendering");
        this.ctx.fillStyle = "#cfcfcf";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.renderBackground();
        this.renderDoc();
        this.renderForeground();

        this.isDirty = false;

        if (this.isDirty) {
            // console.log("is dirty");
            window.requestAnimationFrame(this.render.bind(this));
        }
    }

    update() {
        console.debug("updating");
        this.isDirty = true;
        this.render();
    }

    get state() {
        return this._state;
    }

    get doc() {
        return GlobalValues.currDoc;
    }

    viewToDocCoords(x: number, y: number) {
        return new Vec2(
            (x - this.state.docOffset.x) / this.state.docScale,
            (y - this.state.docOffset.y) / this.state.docScale
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
        this.state.docOffset = this.state.docOffset.addXY(x, y);
    }

    relativeZoom(x: number, y: number, zoom: number) {
        if (this.state.docScale > 100) {
            if (zoom > 1) {
                return;
            }
        }
        let oldScale = this.state.docScale;
        let newScale = oldScale * zoom;
        let oldOffset = this.state.docOffset;
        let newOffset = new Vec2(
            oldOffset.x + (x - oldOffset.x) * (1 - zoom),
            oldOffset.y + (y - oldOffset.y) * (1 - zoom)
        );
        this.state.docScale = newScale;
        this.state.docOffset = newOffset;
    }

    get mousePos() {
        return this.events.lastMousePoint;
    }

    docToViewCoords(x: number, y: number) {
        return new Vec2(
            x * this.state.docScale + this.state.docOffset.x,
            y * this.state.docScale + this.state.docOffset.y
        );
    }


    renderDoc() {
        this.ctx.save();
        this.ctx.translate(this.state.docOffset.x, this.state.docOffset.y);
        this.ctx.scale(this.state.docScale, this.state.docScale);
        // if scale is bigger than 1, don't use image smoothing
        this.ctx.imageSmoothingEnabled = !(this.state.docScale > 1);
        if (this.doc.isDirty) {
            this.doc.render();
        }
        this.ctx.drawImage(this.doc.canvas, 0, 0);
        this.ctx.restore();
    }

    renderBackground() {
        // Draw background
        this.ctx.save();
        this.ctx.filter = "blur(4px)";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            this.state.docOffset.x,
            this.state.docOffset.y + 1,
            this.doc.width * this.state.docScale,
            this.doc.height * this.state.docScale + 1
        );
        this.ctx.restore();

        // Draw background layer
        this.ctx.save();
        this.ctx.translate(this.state.docOffset.x, this.state.docOffset.y);
        this.ctx.scale(this.state.docScale, this.state.docScale);
        // if scale is bigger than 1, don't use image smoothing
        this.ctx.imageSmoothingEnabled = !(this.state.docScale > 1)
        if (this.background == nullLayer) {
            console.log("Background is null");

        } else {
            this.ctx.drawImage(this.background.canvas, 0, 0);
        }
        this.ctx.restore();
    }

    drawScrollBars(barWidth: number, color1: string, color2: string) {
        if (this.doc.width * this.state.docScale > this.width) {
            this.ctx.fillStyle = color1;
            this.ctx.fillRect(
                0,
                this.height - barWidth,
                this.width,
                barWidth
            );
            this.ctx.fillStyle = color2;

            let barXWidth = this.width * this.width / (this.doc.width * this.state.docScale);
            let barXPos = -this.state.docOffset.x * this.width / (this.doc.width * this.state.docScale);
            this.ctx.fillRect(
                barXPos,
                this.height - barWidth,
                barXWidth,
                barWidth
            );

        }

        if (this.doc.height * this.state.docScale > this.height) {
            this.ctx.fillStyle = color1;
            this.ctx.fillRect(
                this.width - barWidth,
                0,
                barWidth,
                this.height
            );
            this.ctx.fillStyle = color2;

            let barYHeight = this.height * this.height / (this.doc.height * this.state.docScale);
            let barYPos = -this.state.docOffset.y * this.height / (this.doc.height * this.state.docScale);
            this.ctx.fillRect(
                this.width - barWidth,
                barYPos,
                barWidth,
                barYHeight
            );
        }
    }

    renderForeground() {
        if (this.state.docScale > 9) {
            this.ctx.save();
            // Draw a grid
            this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
            this.ctx.lineWidth = 0.5;
            let startingX = Math.max(
                this.state.docOffset.x % this.state.docScale,
                this.state.docOffset.x
            );
            let startingY = Math.max(
                this.state.docOffset.y % this.state.docScale,
                this.state.docOffset.y
            );

            let endX = (this.state.docOffset.x + this.doc.width * this.state.docScale);
            if (endX > this.width) {
                endX = this.width;
            }
            let endY = (this.state.docOffset.y + this.doc.height * this.state.docScale);
            if (endY > this.height) {
                endY = this.height;
            }

            for (let i = startingX; i < endX; i += this.state.docScale) {
                this.ctx.beginPath();
                this.ctx.moveTo(i, startingY);
                this.ctx.lineTo(i, endY);
                this.ctx.stroke();
            }

            for (let i = startingY; i < endY; i += this.state.docScale) {
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
    // scale: Vec2 = new Vec2(1, 1);
}

class ViewerState {
    _animationSmooth = new SmoothNumber(1, 1, 0.1);
    _docOffset: Vec2 = new Vec2(0, 0);
    get docOffset() {
        return this._docOffset;
    }

    set docOffset(value: Vec2) {
        this._docOffset = value;
    }

    _docScale: number = 1;
    _docScaleTarget: number = 1;

    get docScale() {
        return this._docScale;
    }

    set docScale(value: number) {
        this._docScale = value;
    }

    get docScaleTarget() {
        return this._docScaleTarget;
    }

    set docScaleTarget(value: number) {
        this._docScaleTarget = value;
    }

    zoomSmoothness: number = 0.1;
}
