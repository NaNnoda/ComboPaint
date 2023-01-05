import EventHandler from "../Core/Events/EventHandler";

type UIEventKey = "closeContextMenu" | "showContextMenu";

export class ReactUIGlobalEvent extends EventHandler<UIEventKey> {
}

export const reactEvent = new ReactUIGlobalEvent();
