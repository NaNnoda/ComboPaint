import ComboPaintDocument from "./ComboPaintDocument";
import {CanvasWrapper} from "./CanvasWrapper";
import {Vec2} from "./MathUtils/Vec2";
import {PaintToolEventHandler} from "./Events/PaintToolEventHandler";
import {PointerEventHandler, PointerPoint} from "./Events/PointerEventHandler";
import {ViewerEventsHandler} from "./Events/ViewerEventsHandler";

/**
 * Class that renders a ComboPaintDocument to a canvas.
 * and also handles user input.
 */
export class DocViewer extends CanvasWrapper {
    _doc: ComboPaintDocument;

    _state: TranslateState;

    paintToolEventHandler: PaintToolEventHandler;
    events: ViewerEventsHandler;

    constructor(canvas: HTMLCanvasElement, doc: ComboPaintDocument) {
        super(canvas);
        this._doc = doc;
        this.setDocument(doc);
        this._state = new TranslateState();
        let offset = new Vec2(0, 0);
        let scale = 3;
        offset.x = (this.width) / 2 - this.doc.width / 2 * scale;
        offset.y = (this.height) / 2 - this.doc.height / 2 * scale;
        this.state.offset = offset;
        this.state.scale = new Vec2(scale);

        this.paintToolEventHandler = new PaintToolEventHandler();
        this.events = new ViewerEventsHandler(canvas);
        this.setUpEventHandlers();

    }

    setUpEventHandlers() {
        this.events.registerEvent("rawPointer", this.triggerPaintTool.bind(this));
        this.events.registerEvent("midDrag", (e: PointerEvent) => {

            let offset = this.state.offset;
            let lastE = this.events.lastMousePoint;
            if (lastE === null) {
                return;
            }
            let dx = e.clientX - lastE.clientX;
            let dy = e.clientY - lastE.clientY;
            console.log({dx, dy});
            this.state.offset = offset.addXY(dx, dy);
            this.render();
        });
        this.events.registerEvent("wheel", (e: WheelEvent) => {
            // e.preventDefault();
            console.log("Wheel");
            console.log(e.deltaY);
            this.relativeZoom(1 - e.deltaY / 1000);
            console.log(this.state.scale);
            this.render();
        });
    }

    triggerPaintTool(raw: PointerEvent) {
        let pos = this.viewToDocCoords(raw.offsetX, raw.offsetY);
        this.paintToolEventHandler.triggerEvent("raw", raw, pos);
    }


    setDocument(doc: ComboPaintDocument) {
        this._doc = doc;
    }

    render() {
        console.log("Rendering");
        // set background color
        this.ctx.fillStyle = "#c4c4c4";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.renderBorder();
        this.renderDoc();
        // console.log("Rendered");
    }

    get state() {
        return this._state;
    }

    get doc() {
        return this._doc;
    }

    viewToDocCoords(x: number, y: number) {
        return new Vec2(
            (x - this.state.offset.x) / this.state.scale.x,
            (y - this.state.offset.y) / this.state.scale.y
        );
    }

    relativeZoom(zoom: number) {
        if (this.events.lastPointerPoint === null) {
            return;
        }

        let x = this.events.lastPointerPoint.x;
        let y = this.events.lastPointerPoint.y;
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
        this.doc.render();

        // if scale is bigger than 1, don't use image smoothing
        if (this.state.scale.x > 1 || this.state.scale.y > 1) {
            this.ctx.imageSmoothingEnabled = false;
            // if scale is bigger than 2, draw a grid
            if (this.state.scale.x > 2 || this.state.scale.y > 2) {
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = "black";
                this.ctx.beginPath();
                for (let x = 0; x < this.doc.width; x++) {
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, this.doc.height);
                }
                for (let y = 0; y < this.doc.height; y++) {
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.doc.width, y);
                }
                this.ctx.stroke();
            }
        } else {
            this.ctx.imageSmoothingEnabled = true;
        }

        this.ctx.drawImage(this.doc.canvas, 0, 0);
        this.ctx.restore();
    }

    renderBorder() {
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
    }
}

class TranslateState {
    offset: Vec2 = new Vec2(0, 0);
    scale: Vec2 = new Vec2(1, 1);
}
