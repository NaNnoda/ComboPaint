import EventHandler from "../Events/EventHandler";

export type globalEventKey = "update" | "docCanvasUpdate";

export class JPGlobalEvent extends EventHandler<globalEventKey> {

}

export const globalEvent = new JPGlobalEvent();
