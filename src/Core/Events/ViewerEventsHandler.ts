import EventHandler from "./EventHandler";
import {PointerEventHandler} from "./PointerEventHandler";
import {DocCanvasViewer} from "../UI/DocCanvasViewer";

export type WheelEventKeys = "midDrag" | "wheel" | "rawPointer" | "docOffset" | "docScale";

export class ViewerEventsHandler extends EventHandler<WheelEventKeys> {
    lastMousePoint: MouseEvent | null = null;
    lastPointerPoint: PointerEvent | null = null;
    isMidDragging: boolean = false;

    pointerEvent: PointerEventHandler;

    viewer: DocCanvasViewer;

    constructor(viewer: DocCanvasViewer) {
        super();
        this.registerEvent("midDrag", this.onMidDrag.bind(this));
        this.registerEvent("wheel", this.onWheel.bind(this));
        let canvas = viewer.canvas;
        canvas.style.cursor = "crosshair";
        canvas.addEventListener("wheel", (e) => {
            this.triggerEvent("wheel", e);
        });
        canvas.addEventListener("mousedown", (e) => {
            if (e.button === 1) {
                e.preventDefault();
                canvas.style.cursor = "grabbing";
                this.isMidDragging = true;
                this.lastMousePoint = e;
            }
        });
        canvas.addEventListener("mouseup", (e) => {
            if (e.button === 1) {
                this.isMidDragging = false;
                canvas.style.cursor = "crosshair";
            }
            this.lastMousePoint = null;
        });
        canvas.addEventListener("mousemove", (e) => {
            // console.log({x: e.offsetX, y: e.offsetY});
            if (this.isMidDragging) {
                this.triggerEvent("midDrag", e);
            }
            this.lastMousePoint = e;
        });
        canvas.addEventListener("mouseleave", (e) => {
            this.isMidDragging = false;
            this.lastMousePoint = null;
        });
        this.pointerEvent = PointerEventHandler.createFromHTMLElement(canvas);
        this.pointerEvent.registerEvent("raw", this.onRawPointer.bind(this));

        this.viewer = viewer;
    }

    onRawPointer(e: PointerEvent) {
        this.lastPointerPoint = e;
        // console.log("raw pointer");

        let pos = this.viewer.viewToDocCoords(e.offsetX, e.offsetY);

        if (e.button !== 1) {
            this.viewer.paintToolEventHandler.triggerEvent("raw", e, pos);
        }
    }

    onMidDrag(e: MouseEvent) {
        e.preventDefault();
        // console.log("mid drag");
    }

    onWheel(e: WheelEvent) {
        // console.log("wheel");
    }
}
