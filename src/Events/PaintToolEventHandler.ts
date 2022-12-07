import {PointerEventHandler} from "./PointerEventHandler";
import {PaintTool} from "../PaintTools/PaintTool";

export class PaintToolEventHandler extends PointerEventHandler {
    tool: PaintTool;

    constructor(tool: PaintTool) {
        super();
        this.tool = tool;
    }
}
