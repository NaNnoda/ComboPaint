import {OffScreenCanvasWrapper} from "../CanvasWrappers/OffScreenCanvasWrapper";

export abstract class JPLayer extends OffScreenCanvasWrapper {
    name: string;
    visible: boolean;
    opacity: number;
    blendMode: GlobalCompositeOperation;

    constructor(width: number, height: number, name: string = "New Layer", ctxId: OffscreenRenderingContextId) {
        super(width, height, ctxId);
        this.name = name;
        this.visible = true;
        this.opacity = 1;
        this.blendMode = "source-over";
    }
}
