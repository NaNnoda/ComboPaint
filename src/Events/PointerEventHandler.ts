import EventHandler from "./EventHandler";
import {Vec2} from "../MathUtils/Vec2";

export type PointerEventKeys = "any" | "down" | "up" | "move" | "leave" | "enter";

export class PointerPoint {
    pos: Vec2;
    pressure: number;
    pointType: PointerEventKeys = "any";

    constructor(pos: Vec2, pressure: number) {
        this.pos = pos;
        this.pressure = pressure;
    }

    static pointerEventToPointerPoint(e: PointerEvent): PointerPoint {
        return new PointerPoint(new Vec2(e.offsetX, e.offsetY), e.pressure);
    }
}

export class PointerEventHandler extends EventHandler<PointerEventKeys> {
    constructor() {
        super();
        console.log("PointerEventHandler created");
        this.registerEvent("any", this.onAny.bind(this));
    }

    static bindWithElement(element: HTMLElement) {
        let handler = new PointerEventHandler();
        element.addEventListener("pointerdown", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerup", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointermove", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerenter", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerleave", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerover", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointerout", handler.rawPointerEvent.bind(handler));
        element.addEventListener("pointercancel", handler.rawPointerEvent.bind(handler));
        return handler;
    }

    rawPointerEvent(rawEvent: PointerEvent) {
        let point = PointerPoint.pointerEventToPointerPoint(rawEvent);
        this.triggerEvent("any", point);
    }

    onAny(point: PointerPoint) {
        console.log(
            {
                x: point.pos.x, y: point.pos.y
            });
    }
}

class PointerHandlerState {
    wasDown: boolean = false;
    isDown: boolean = false;

    lastPressure: number = 0;
}
