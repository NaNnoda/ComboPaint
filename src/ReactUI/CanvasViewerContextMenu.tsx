import React from "react";
import ColorPicker from "./ColorPicker/ColorPicker";
import {reactEvent} from "./ReactUIGlobalEvent";

interface ICanvasViewerContextMenuProps {
    x: number;
    y: number;
}

function CanvasViewerContextMenu(props: ICanvasViewerContextMenuProps) {

    return (
        <div
            className="context-menu"
            style={{
                left: props.x,
                top: props.y,
                position: "absolute",
                width: "fit-content",
                height: "fit-content",
                backgroundColor: "white",
                border: "1px solid black",
            }}
            onClick={
                (e) => {
                    console.log("CanvasViewerContextMenu clicked");
                    e.stopPropagation();
                    // reactEvent.triggerEvent("closeContextMenu");
                }
            }>
            <h1>Context Menu</h1>
            <button onClick={() => {
                reactEvent.triggerEvent("closeContextMenu")
            }}>Close
            </button>
            <ColorPicker size={250} padding={20}/>
        </div>
    );
}

export default CanvasViewerContextMenu;
