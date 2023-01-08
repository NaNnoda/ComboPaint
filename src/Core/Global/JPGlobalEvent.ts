import EventHandler from "../Events/EventHandler";
import Color from "../DataTypes/Color";

export type globalEventKey = "update" | "docCanvasUpdate" | "mainColorChange";

export class JPGlobalEvent extends EventHandler<globalEventKey> {
    changeMainColor(color: string) {
        if (!color.startsWith("#")) {
            throw new Error("Color must start with #");
        }
        this.triggerEvent("mainColorChange", color);
    }

    addChangeMainColorListener(listener: (color: string) => void) {
        this.registerEvent("mainColorChange", listener);
    }
}

export const globalEvent = new JPGlobalEvent();
