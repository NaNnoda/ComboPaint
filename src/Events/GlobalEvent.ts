import EventHandler from "./EventHandler";

export type globalEventKey = "update" | "docCanvasUpdate";

export class GlobalEvent extends EventHandler<globalEventKey> {

}
