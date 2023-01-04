import React, {useEffect} from "react";
import {FC} from "react";
import {initCanvas} from "../Initializer";

function CanvasReact(props: any) {
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
    return <canvas id="viewCanvas" ref={canvasRef}/>;
}

export default CanvasReact;
