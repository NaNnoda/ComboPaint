import EventHandler from "../Events/EventHandler";

export type globalEventKey = "update" | "docCanvasUpdate";

export class GlobalEvent extends EventHandler<globalEventKey> {

}

export const globalEvent = new GlobalEvent();
