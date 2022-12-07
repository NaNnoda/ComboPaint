import {PaintToolEventHandler} from "../Events/PaintToolEventHandler";

export class PaintTool {
    name: string;
    eventHandler: PaintToolEventHandler;

    constructor(name: string) {
        this.name = name;
        this.eventHandler = new PaintToolEventHandler(this);
    }
}
