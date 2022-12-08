import EventHandler from "./EventHandler";
import {PointerEventHandler} from "./PointerEventHandler";
import {DocViewer} from "../DocViewer";

export type WheelEventKeys = "midDrag" | "wheel" | "rawPointer";

export class ViewerEventsHandler extends EventHandler<WheelEventKeys> {
    lastMousePoint: MouseEvent | null = null;
    lastPointerPoint: PointerEvent | null = null;
    isMidDragging: boolean = false;

    pointerEvent: PointerEventHandler;

    constructor(viewer: DocViewer) {
        super();
        this.registerEvent("midDrag", this.onMidDrag.bind(this));
        this.registerEvent("wheel", this.onWheel.bind(this));
        let canvas = viewer.canvas;
        canvas.addEventListener("wheel", (e) => {
            this.triggerEvent("wheel", e);
        });
        canvas.addEventListener("mousedown", (e) => {
            if (e.button === 1) {
                this.isMidDragging = true;
                this.lastMousePoint = e;
            }
        });
        canvas.addEventListener("mouseup", (e) => {
            if (e.button === 1) {
                this.isMidDragging = false;
            }
            this.lastMousePoint = null;
        });
        // canvas.addEventListener("mousemove", (e) => {
        //     console.log({x: e.offsetX, y: e.offsetY});
        //     if (this.isMidDragging) {
        //         this.triggerEvent("midDrag", e);
        //     }
        // });
        this.pointerEvent = PointerEventHandler.createFromHTMLElement(canvas);
        this.pointerEvent.registerEvent("raw", this.onRawPointer.bind(this));
    }

    onRawPointer(e: PointerEvent) {
        this.lastPointerPoint = e;
        console.log("raw pointer");

        if (this.isMidDragging) {
            this.triggerEvent("midDrag", e);
        }
    }

    onMidDrag(e: MouseEvent) {
        // console.log("mid drag");
    }

    onWheel(e: WheelEvent) {
        // console.log("wheel");
    }
}
