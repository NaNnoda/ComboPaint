import EventHandler from "./EventHandler";
import {Vec2} from "../MathUtils/Vec2";

export type PointerEventKeys = "raw" | "down" | "up" | "move" | "leave" | "enter" | "pressedMove" | "last";

export class PointerPoint {
    pos: Vec2;
    pressure: number;

    constructor(pos: Vec2, pressure: number) {
        this.pos = pos;
        this.pressure = pressure;
    }

    static pointerEventToPointerPoint(e: PointerEvent): PointerPoint {
        return new PointerPoint(new Vec2(e.offsetX, e.offsetY), e.pressure);
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }
}

export class PointerEventHandler extends EventHandler<PointerEventKeys> {
    constructor() {
        super();
        console.log("PointerEventHandler created");
        this.registerEvent("raw", this.onRaw.bind(this));
    }

    static createFromHTMLElement(element: HTMLElement) {
        let handler = new PointerEventHandler();
        PointerEventHandler.bindWithElement(handler, element);
        return handler;
    }

    static bindWithElement(handler: PointerEventHandler, element: HTMLElement) {

        element.addEventListener("pointerdown", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerup", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointermove", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerenter", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerleave", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerover", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerout", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointercancel", handler.rawPointerEvent.bind(handler));

        element.addEventListener("touchmove", (e) => {
            e.preventDefault();
            // let touch = e.touches[0];
            // handler.onRaw(e, new Vec2(touch.clientX, touch.clientY));
        });
    }

    wasDown: boolean = false;
    lastPoint: PointerPoint | null = null;

    rawPointerEvent(rawEvent: PointerEvent) {
        this.triggerEvent("raw", rawEvent);
    }

    onRaw(rawEvent: PointerEvent, customPos: Vec2|null = null) {
        // rawEvent.preventDefault();
        console.log("PointerEventHandler.onRaw");
        let point = PointerPoint.pointerEventToPointerPoint(rawEvent);
        if (customPos !== null) {
            point.pos = customPos;
        }

        switch (rawEvent.type) {
            case "pointerdown":
                this.triggerEvent("down", point);
                this.wasDown = true;
                break;
            case "pointerup":
                this.triggerEvent("up", point);
                this.wasDown = false;
                break;
            case "pointermove":
                this.triggerEvent("move", point);
                if (this.wasDown) {
                    this.triggerEvent("pressedMove", point);
                }
                break;
            case "pointerenter":
                this.triggerEvent("enter", point);
                break;
            case "pointerleave":
                this.triggerEvent("leave", point);
                this.wasDown = false;
                break;
        }
        this.lastPoint = point;
    }
}

class PointerHandlerState {
    wasDown: boolean = false;
    isDown: boolean = false;

    lastPressure: number = 0;
}
