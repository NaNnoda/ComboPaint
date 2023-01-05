import React from "react";
import {createRoot} from "react-dom/client";
import ViewerCanvasComponent from "./ViewerCanvasComponent";
import CanvasViewerContextMenu from "./CanvasViewerContextMenu";
import {reactEvent} from "./ReactUIGlobalEvent";

/**
 * The main entry point for the application.
 * @constructor
 */
function App() {
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [contextMenuVisible, setContextMenuVisible] = React.useState(false);

    function showContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        e.preventDefault();
        const {pageX, pageY} = e;
        setX(pageX);
        setY(pageY);
        setContextMenuVisible(true);
    }

    function closeContextMenu() {
        setContextMenuVisible(false);
    }

    reactEvent.registerEvent("closeContextMenu", closeContextMenu);
    reactEvent.registerEvent("showContextMenu", showContextMenu);

    return (
        <div
            id="app"
            onContextMenu={showContextMenu}
            style={{width: "100%", height: "100%"}}
            onClick={
                (e) => {
                    console.log("App clicked");
                }
            }
        >
            <ViewerCanvasComponent/>
            {
                contextMenuVisible &&
                <CanvasViewerContextMenu x={x} y={y}></CanvasViewerContextMenu>
            }
        </div>
    );
}

export function createApp(element: HTMLElement) {
    const root = createRoot(element);
    root.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );

    console.log("App.tsx: App() rendered");
}

