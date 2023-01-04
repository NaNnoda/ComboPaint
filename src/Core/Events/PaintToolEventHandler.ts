import {PointerEventHandler, PointerPoint} from "./PointerEventHandler";
import {PaintTool} from "../PaintTools/PaintTool";

export class PaintToolEventHandler extends PointerEventHandler {
    _tool: PaintTool | null = null;

    constructor() {
        super();
    }

    get tool() {
        if (this._tool === null) {
            throw new Error("Tool not set");
        }
        return this._tool;
    }
    set tool(tool: PaintTool) {
        this._tool = tool;
    }

    bind(tool: PaintTool) {
        this.tool = tool;
        this.registerEvent("down", this.onDown.bind(this));
        this.registerEvent("up", this.onUp.bind(this));
        this.registerEvent("pressedMove", this.onPressedMove.bind(this));
        this.registerEvent("move", this.onMove.bind(this));
    }

    onDown(point: PointerPoint) {
        this.tool.onDown(point);
    }

    onUp(point: PointerPoint) {
        this.tool.onUp(point);
    }

    onPressedMove(point: PointerPoint) {
        this.tool.onPressedMove(point);
    }

    onMove(point: PointerPoint) {
        this.tool.onMove(point);
    }
}
