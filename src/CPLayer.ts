import {CanvasWrapper} from "./CanvasWrapper";

export class CPLayer extends CanvasWrapper {
    name: string;
    visible: boolean;
    opacity: number;
    blendMode: GlobalCompositeOperation;

    constructor(width: number, height: number, name: string = "New Layer") {
        super();
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