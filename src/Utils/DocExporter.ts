import ComboPaintDocument from "../ComboPaintDocument";
import * as psd from "ag-psd"


export class DocExporter {
    static docToPNG(doc: ComboPaintDocument): string {
        doc.render();
        let canvas = document.createElement("canvas");
        canvas.width = doc.width;
        canvas.height = doc.height;
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("Failed to get context");
        }
        for (let layer of doc.layers) {
            ctx.drawImage(layer.canvas, 0, 0);
        }
        return canvas.toDataURL("image/png");
    }

    static docToPSD(doc: ComboPaintDocument): void {
        console.log("Exporting to PSD");

        class psdFile {
            width: number;
            height: number;
            children: any[] = [];

            constructor(width: number, height: number) {
                this.width = width;
                this.height = height;
            }
        }

        let psdDoc = new psdFile(doc.width, doc.height);
        for (let layer of doc.layers) {
            let newLayer: any = {}
            newLayer["name"] = layer.name;
            // let bmp = layer.canvas.transfer
        }

        let psdDict = {
            width: doc.width,
            height: doc.height,
            children: [
                {
                    name: "Layer 1",
                }
            ]
        }

        let buffer = psd.writePsd(psdDoc);
        let blob = new Blob([buffer], {type: "image/psd"});
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "test.psd";
        a.click();


    }
}
