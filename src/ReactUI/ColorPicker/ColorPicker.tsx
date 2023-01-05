import React, {useEffect} from "react";
import {useState} from "react";
import {globalEvent} from "../../Core/Global/JPGlobalEvent";
import fragmentShader from "./Shaders/GradientShader.frag";

interface ColorPickerProps {
    size: number;
    padding: number;
}

function ColorPickerCanvas(props: ColorPickerProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const canvasSize = props.size + props.padding * 2;
    useEffect(() => {
        console.log("ColorPickerCanvas useEffect");

        if (!canvasRef.current) {
            console.log("ColorPickerCanvas useEffect: canvasRef.current is null");
            return;
        }
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) {
            console.log("ColorPickerCanvas useEffect: ctx is null");
            return;
        }
        // ctx.fillStyle = "red";
        // ctx.fillRect(0, 0, 100, 100);
        let mid = props.size / 2 + +props.padding;
        let lineWidth = 20;
        drawColorRing(ctx, mid, mid, canvasSize / 2 - lineWidth, lineWidth);

        let gradientStart = mid - props.size / 2;
        let gradientEnd = props.size / 2;
        drawColorGradient(ctx, 100, 100, 150, 150);
        console.log("ColorPickerCanvas useEffect end");
    }, []);

    createGradientImage(100, 100, 0);

    return (
        <canvas
            width={canvasSize}
            height={canvasSize}
            style={
                {
                    width: `${canvasSize}px`,
                    height: `${canvasSize}px`,
                }
            }
            ref={canvasRef}>
        </canvas>
    );
}

function drawColorRing(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, lineWidth: number) {
    ctx.lineWidth = lineWidth;
    ctx.imageSmoothingEnabled = true;
    for (let i = 0; i < 360; i++) {
        ctx.beginPath();
        ctx.arc(x, y, radius, i * Math.PI / 180, (i + 1) * Math.PI / 180);
        ctx.strokeStyle = "hsl(" + i + ", 100%, 50%)";
        ctx.stroke();
    }
}

function createGradientImage(width: number, height: number, hue: number) {
    let canvas = new OffscreenCanvas(width, height);
    let ctx = canvas.getContext("webgl2");
    let baseTexture = canvas.transferToImageBitmap();

    console.log(fragmentShader);



}

function drawColorGradient(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, hue: number = 0) {

    //
    // let gradient2 = ctx.createLinearGradient(width + x, y, width + x, height + y);
    // gradient2.addColorStop(0, "hsla(" + hue + ", 100%, 100%, 1)");
    // gradient2.addColorStop(1, "hsla(" + hue + ", 100%, 0%, 1)");
    // ctx.fillStyle = gradient2;
    // ctx.fillRect(x, y, width, height);
    //
    // let gradient = ctx.createLinearGradient(x, height+y, width + x, height+y);
    // gradient.addColorStop(0, "hsla(" + hue + ", 0%, 50%, 0)");
    // gradient.addColorStop(1, "hsla(" + hue + ", 100%, 50%, 1)");
    // ctx.fillStyle = gradient;
    // ctx.globalCompositeOperation = "multiply";
    // ctx.fillRect(x, y, width, height);


    let gradientSaturation = ctx.createRadialGradient(x + width, y, 0, x + width, y, width);
    gradientSaturation.addColorStop(0, "hsla(" + hue + ", 100%, 50%, 1)");
    gradientSaturation.addColorStop(1, "hsla(" + hue + ", 100%, 50%, 1)");
    // ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = gradientSaturation;
    ctx.fillRect(x, y, width, height);
    let gradientWhite = ctx.createRadialGradient(x, y, 0, x, y, width);
    gradientWhite.addColorStop(0, "rgba(255,255,255,1)");
    gradientWhite.addColorStop(1, "rgba(255,255,255,0)");
    // ctx.globalCompositeOperation = "lighten";
    ctx.fillStyle = gradientWhite;
    ctx.fillRect(x, y, width, height);
    let midX = x + width / 2;
    let backgroundGradient = ctx.createLinearGradient(x + width, y, width + x, height + y);
    backgroundGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    backgroundGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(x, y, width, height);
    let gradientBlack = ctx.createRadialGradient(midX, y + height, 0, midX, y + height, width);
    gradientBlack.addColorStop(0, "rgba(0,0,0,1)");
    // gradientBlack.addColorStop(0.2, "rgba(0,0,0,0.3)");
    gradientBlack.addColorStop(1, "rgba(0,0,0,0)");
    // ctx.globalCompositeOperation = "darken";
    ctx.fillStyle = gradientBlack;
    // ctx.fillRect(x, y, width, height);
}

function ColorPicker(props: ColorPickerProps) {
    const [color, setColor] = useState("#000000");
    return (
        <div style={{display: "flex", position: "relative"}}>
            <ColorPickerCanvas padding={props.padding} size={props.size}/>
            <input type="color"
                   value={color}
                   onChange={
                       (e) => {
                           globalEvent.changeMainColor(e.target.value);
                       }
                   }
                   style={{
                       position: "absolute",
                       left: `${props.padding}px`,
                       top: `${props.size}px`,
                   }}/>
        </div>
    );
}

export default ColorPicker;
