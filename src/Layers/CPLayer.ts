import {CanvasWrapper} from "../CanvasWrapper";
import {OffScreenCanvasWrapper2D} from "../OffScreenCanvasWrapper2D";

export class CPLayer extends OffScreenCanvasWrapper2D {
    name: string;
    visible: boolean;
    opacity: number;
    blendMode: GlobalCompositeOperation;

    constructor(width: number, height: number, name: string = "New Layer") {
        super(width, height);
        this.width = width;
        this.height = height;
        this.name = name;
        this.visible = true;
        this.opacity = 1;
        // this.blendMode = "normal";
        this.blendMode = "source-over";
    }

    render() {

    }
}
