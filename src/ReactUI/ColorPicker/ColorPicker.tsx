import React, {useEffect} from "react";
import {useState} from "react";
import {globalEvent} from "../../Core/Global/JPGlobalEvent";
import fragmentShaderString from "./Shaders/GradientShader.frag";
import vertexShaderString from "./Shaders/GradientShader.vert";
import {func} from "prop-types";
import Color from "../../Core/DataTypes/Color";
import {globalVar} from "../../Core/Global/JPGlobalVar";

interface ColorPickerProps {
    size: number;
    padding: number;
}

function ColorPickerCanvas(props: ColorPickerProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const size = props.size;
    const padding = props.padding;

    const outerRing = size - padding * 2;
    const ringWidth = 20;
    const innerRing = outerRing - ringWidth * 4;
    const ringRadius = outerRing / 2 - ringWidth;


    const gradientSize = Math.sqrt(innerRing * innerRing / 2);

    const colorRingImage: ImageBitmap = getColorRingImage(outerRing, outerRing, ringWidth);

    const canvasSize = props.size - props.padding * 2;
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;

    const gradientLeft = centerX - gradientSize / 2;
    const gradientTop = centerY - gradientSize / 2;
    const gradientRight = centerX + gradientSize / 2;
    const gradientBottom = centerY + gradientSize / 2;


    const [h, s, l] = Color.hexStrToHSL(globalVar.mainColor);

    let hueDegree = h;

    let saturation = s;
    let lightness = l;

    let dirty = true;


    function changeMainColor() {
        // // setCurrColor(color);
        // let {h, s, l} = Color.hexStrToHSL(color);
        // console.log("onColorChange: " + h + " " + s + " " + l);
        // hueDegree = h;

        let color = Color.hslToHex(hueDegree, saturation, lightness);
        globalEvent.changeMainColor(color);
    }

    // globalEvent.registerEvent("mainColorChange", onColorChange);


    function inGradientRange(x: number, y: number) {
        return x >= gradientLeft && x <= gradientRight && y >= gradientTop && y <= gradientBottom;
    }

    function inRingRange(x: number, y: number) {
        let distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
        if (Math.abs(distance - ringRadius) <= ringWidth / 2) {
            return true;
        }
    }

    function redrawCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImageInCenter(ctx, canvas, colorRingImage);

        let gradientImage = getGradientImage(gradientSize, gradientSize, hueDegree);

        drawImageInCenter(ctx, canvas, gradientImage);

        drawHueCircle(ctx);
        drawGradientCircle(ctx);
    }

    function drawHueCircle(ctx: CanvasRenderingContext2D) {
        let c = hueDegree + 180 + 45;
        console.log("hueDegree: " + hueDegree);
        let x = ringRadius * Math.cos(c * Math.PI / 180);
        let y = ringRadius * Math.sin(c * Math.PI / 180);
        let color = `hsl(${hueDegree}, 100%, 50%)`;
        drawColorCircle(ctx, centerX + x, centerY + y, color);
    }

    function drawGradientCircle(ctx: CanvasRenderingContext2D) {
        let relaX = saturation / 100;
        let relaY = (1 - lightness) / 100 + 0.5 * (1 - relaX) + 0.5;
        let dx = gradientSize * relaX;
        let dy = gradientSize * relaY;
        let x = gradientLeft + dx;
        let y = gradientTop + dy;
        console.log({dx, dy});
        let color = `hsl(${hueDegree}, ${saturation}%, ${lightness}%)`;
        console.log(color);
        drawColorCircle(ctx, x, y, color);
    }

    function updateHue(x: number, y: number) {
        let degree = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
        hueDegree = degree - 180 - 45;
        console.log("updateHue: " + hueDegree);
    }

    function updateSaturationAndLightness(x: number, y: number) {
        let dx = x - gradientLeft;
        let dy = y - gradientTop;

        let relaX = dx / gradientSize;
        let relaY = dy / gradientSize;

        saturation = relaX * 100;
        lightness = (1 - relaY) * 100 - 50 * (relaX);
        console.log({saturation, lightness});
    }

    function initCanvas(canvas: HTMLCanvasElement) {
        let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (!ctx) {
            console.log("initCanvas: ctx is null");
            throw new Error("initCanvas: ctx is null");
        }

        redrawCanvas(canvas, ctx);

        canvas.addEventListener("pointermove", (e) => {
            // onColorChange("#ff0000");
            let x = e.offsetX;
            let y = e.offsetY;

            let pressed = e.pressure > 0;

            if (inGradientRange(x, y)) {
                console.log("inGradientRange");
                if (pressed) {
                    updateSaturationAndLightness(x, y);
                }
            }

            if (inRingRange(x, y)) {
                console.log("inRingRange");
                if (pressed) {
                    updateHue(x, y);
                }
            }
            changeMainColor();
            redrawCanvas(canvas, ctx);
        });
    }

    useEffect(() => {
        console.log("ColorPickerCanvas useEffect");
        if (!canvasRef.current) {
            console.log("ColorPickerCanvas useEffect: canvasRef.current is null");
            return;
        }
        const canvas = canvasRef.current;
        initCanvas(canvas);

    }, []);

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

function drawImageInCenter(ctx: CanvasRenderingContext2D, canvas: OffscreenCanvas | HTMLCanvasElement, image: ImageBitmap) {
    let height = canvas.height;
    let width = canvas.width;
    let x = (width - image.width) / 2;
    let y = (height - image.height) / 2;
    ctx.drawImage(image, x, y);
}

function drawColorCircle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, radius: number = 8) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.filter = "drop-shadow(0 0 1px #000000)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.stroke();
    ctx.filter = "none";
    ctx.beginPath();
    ctx.arc(x, y, radius - 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}


function getColorRingImage(width: number, height: number, lineWidth: number, drawOutline: boolean = true): ImageBitmap {
    let canvas = new OffscreenCanvas(width, height);
    let ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    if (!ctx) {
        console.log("getColorRingImage: ctx is null");
        throw new Error("getColorRingImage: ctx is null");
    }

    ctx.lineWidth = lineWidth;
    ctx.filter = "blur(1px)";

    for (let i = 0; i < 360; i++) {
        ctx.beginPath();
        let c = i + 180 + 45;
        ctx.arc(width / 2, height / 2, width / 2 - lineWidth, c * Math.PI / 180, (c + 1) * Math.PI / 180);
        ctx.strokeStyle = "hsl(" + i + ", 100%, 50%)";
        ctx.stroke();
    }

    if (drawOutline) {
        ctx.filter = "none";
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#494949";

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2 - (lineWidth / 2), 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2 - lineWidth * 1.5, 0, 2 * Math.PI);
        ctx.stroke();
    }

    return canvas.transferToImageBitmap();
}

function getGradientImage(width: number = 100, height: number = 100, hueDegree: number = 0, drawOutline = true): ImageBitmap {
    let canvas = new OffscreenCanvas(width, height);
    let ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    if (!ctx) {
        console.log("getRedGradient: ctx is null");
        throw new Error("getRedGradient: ctx is null");
    }

    for (let y = 0; y < height; y++) {
        let gradient = ctx.createLinearGradient(0, 0, width, 0);
        let h = hueDegree;
        let l = 100 - y / height * 100;
        gradient.addColorStop(0, `hsl(${h}, 0%, ${l}%)`);
        gradient.addColorStop(1, `hsl(${h}, 100%, ${l / 2}%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, width, y + 1);
        // ctx.fillRect(0, y, width, y + 1);
    }

    if (drawOutline) {
        ctx.strokeStyle = "#494949";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.stroke();
    }

    return canvas.transferToImageBitmap();
}

function ColorPicker(props: ColorPickerProps) {
    return (
        <div style={{display: "flex", position: "relative"}}>
            <ColorPickerCanvas padding={props.padding} size={props.size}/>
            <input type="color"
                   onChange={
                       (e) => {
                           globalEvent.changeMainColor(e.target.value);
                       }
                   }
                   style={
                       {
                           position: "absolute",
                           left: `${props.padding}px`,
                           top: `${props.size}px`,
                           display: "block",
                           width: `32px`,
                           height: `32px`,
                           overflow: "hidden",
                           // margin: `190px`,
                           border: "#bdbdbd" + " 2px solid",
                           backgroundColor: "#eaeaea",
                           cursor: "pointer",
                       }
                   }

            />
        </div>
    );
}

export default ColorPicker;
