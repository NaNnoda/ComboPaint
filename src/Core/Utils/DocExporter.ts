import JustPaintDocument from "../Documents/JustPaintDocument";
import * as psd from "ag-psd"
import {JPLayer} from "../Layers/JPLayer";


export class DocExporter {
    static exportPNG(doc: JustPaintDocument): string {
        doc.render();
        let canvas = document.createElement("canvas");
        canvas.width = doc.width;
        canvas.height = doc.height;
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("Failed to get context");
        }
        for (let layer of doc.layers) {
            ctx.globalAlpha = layer.opacity;
            ctx.drawImage(layer.canvas, 0, 0);
        }
        return canvas.toDataURL("image/png");
    }

    static exportPSD(doc: JustPaintDocument): string {
        console.log("Exporting to PSD");

        class PsdLayer {
            top: number;
            left: number;
            bottom: number;
            right: number;
            blendMode: string;
            opacity: number;
            transparencyProtected: boolean;
            hidden: boolean;
            clipping: boolean;
            name: string;
            canvas: OffscreenCanvas;

            constructor(cpLayer: JPLayer) {
                this.top = 0;
                this.left = 0;
                this.bottom = cpLayer.height;
                this.right = cpLayer.width;
                this.blendMode = "normal";
                this.opacity = cpLayer.opacity;
                this.transparencyProtected = false;
                this.hidden = false;
                this.clipping = false;
                this.name = cpLayer.name;

                this.canvas = this.canvasToOffScreenCanvas(cpLayer.canvas);
                // this.canvas = cpLayer.canvas;
            }

            canvasToOffScreenCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): OffscreenCanvas {
                let offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
                let ctx = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
                if (ctx === null) {
                    throw new Error("Failed to get context");
                }
                ctx.drawImage(canvas, 0, 0);
                return offscreenCanvas;
            }
        }

        class PsdFile {
            width: number;
            height: number;
            children: PsdLayer[] = [];

            constructor(width: number, height: number) {
                this.width = width;
                this.height = height;
            }
        }

        let psdDoc = new PsdFile(doc.width, doc.height) as any;
        for (let layer of doc.layers) {
            let psdLayer = new PsdLayer(layer);
            psdDoc.children.push(psdLayer);
        }

        let buffer = psd.writePsd(psdDoc);
        let blob = new Blob([buffer], {type: "image/psd"});
        // downloadUrl(url, "test.psd");
        return URL.createObjectURL(blob);
    }
}
