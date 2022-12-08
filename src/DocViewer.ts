import ComboPaintDocument from "./ComboPaintDocument";
import {CanvasWrapper} from "./CanvasWrapper";
import {Vec2} from "./MathUtils/Vec2";
import {PaintToolEventHandler} from "./Events/PaintToolEventHandler";
import {PointerEventHandler} from "./Events/PointerEventHandler";

/**
 * Class that renders a ComboPaintDocument to a canvas.
 * and also handles user input.
 */
export class DocViewer extends CanvasWrapper {
    _doc: ComboPaintDocument;

    _state: TranslateState;

    paintToolEventHandler: PaintToolEventHandler;
    viewPointerHandler: PointerEventHandler;

    constructor(canvas: HTMLCanvasElement, doc: ComboPaintDocument) {
        super(canvas);
        this._doc = doc;
        this.setDocument(doc);
        this._state = new TranslateState();
        let offset = new Vec2(0, 0);
        // center the canvas
        let scale = 2;
        offset.x = (this.width) / 2 - this.doc.width / 2 * scale;
        offset.y = (this.height) / 2 - this.doc.height / 2 * scale;
        this.state.offset = offset;
        this.state.scale = new Vec2(scale);

        this.paintToolEventHandler = new PaintToolEventHandler();
        this.viewPointerHandler = PointerEventHandler.createFromHTMLElement(this.canvas);
        this.viewPointerHandler.registerEvent("raw", this.triggerPaintTool.bind(this));

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
        // this._state.translateToAndSaveCtx(this.ctx);
        this.renderDoc();
        this.renderBorder();
        console.log("Rendered");
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
        this.ctx.drawImage(this.doc.canvas, 0, 0);
        this.ctx.restore();
    }

    renderBorder() {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            this.state.offset.x, this.state.offset.y,
            this.doc.width * this.state.scale.x,
            this.doc.height * this.state.scale.y
        );
    }
}

class TranslateState {
    offset: Vec2 = new Vec2(0, 0);
    scale: Vec2 = new Vec2(1, 1);
}
