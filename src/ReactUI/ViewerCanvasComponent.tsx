import React, {useEffect} from "react";
import {initCanvas} from "../Core/Initializer";
import CanvasViewerContextMenu from "./CanvasViewerContextMenu";
import {reactEvent} from "./ReactUIGlobalEvent";

function ViewerCanvasComponent() {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);


    useEffect(
        () => {
            // console.log(canvasRef.current);
            if (!canvasRef.current) {
                return;
            }
            initCanvas(canvasRef.current);
        },
        []
    );


    return (
        <div style={{
            width: "fit-content",
            height: "fit-content"
        }}
             onClick={
                 (e) => {
                     console.log("ViewerCanvasComponent clicked");
                     console.log(e);
                     reactEvent.triggerEvent("closeContextMenu");
                 }
             }
        >
            <canvas
                id="viewCanvas"
                ref={canvasRef}
            >
            </canvas>
        </div>
    );
}


export default ViewerCanvasComponent;
