import EventHandler from "../Events/EventHandler";

export type globalEventKey = "update" | "docCanvasUpdate" | "mainColorChange";

export class JPGlobalEvent extends EventHandler<globalEventKey> {
    changeMainColor(color: string) {
        this.triggerEvent("mainColorChange", color);
    }
}

export const globalEvent = new JPGlobalEvent();
