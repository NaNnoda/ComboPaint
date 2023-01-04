import React, {useEffect} from "react";
import {FC} from "react";
import {initCanvas} from "../Core/Initializer";

function ViewerCanvasComponent(props: any) {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    useEffect(
        () => {
            console.log(canvasRef.current);
            if (!canvasRef.current) {
                return;
            }

            initCanvas(canvasRef.current);
        },
        []
    );
    return <canvas id="viewCanvas" ref={canvasRef} property={props}/>;
}

export default ViewerCanvasComponent;
