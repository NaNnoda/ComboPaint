import {OffScreenCanvasWrapper} from "../CanvasWrappers/OffScreenCanvasWrapper";

export abstract class CPLayer extends OffScreenCanvasWrapper {
    name: string;
    visible: boolean;
    opacity: number;
    blendMode: GlobalCompositeOperation;

    constructor(width: number, height: number, name: string = "New Layer", ctxId: OffscreenRenderingContextId) {
        super(width, height, ctxId);
        this.width = width;
        this.height = height;
        this.name = name;
        this.visible = true;
        this.opacity = 1;
        this.blendMode = "source-over";
    }
}
