import ComboPaintDocument from "./Document/ComboPaintDocument";
import {CPLayer} from "./Layers/CPLayer";
import {BasicPen} from "./PaintTools/BasicPen";
import {DocExporter} from "./Utils/DocExporter";
import {addToConsole, downloadUrl, setUnscrollable} from "./Utils/Utils";
import {Preference} from "./Preference";
import {GlobalValues} from "./GlobalValues";
import {CPLayer2D} from "./Layers/CPLayer2D";
import {PaintBucket} from "./PaintTools/PaintBucket";

function initConsole() {
    addToConsole("GlobalValues", GlobalValues);
    addToConsole("Preference", Preference);
    // addToConsole("localStorage",localStorage);
    addToConsole("save.png", (name: string = GlobalValues.currDoc.name) => {
        let url = DocExporter.exportPNG(GlobalValues.currDoc);
        downloadUrl(url, `${name}.png`);
    });
    addToConsole("save.psd", (name: string = GlobalValues.currDoc.name) => {
        let url = DocExporter.exportPSD(GlobalValues.currDoc);
        downloadUrl(url, `${name}.psd`);
    });
    addToConsole("currDoc", GlobalValues.currDoc);
    addToConsole("currLayer", GlobalValues.currLayer);
    addToConsole("currTool", GlobalValues.currTool);
    addToConsole("doc.addLayer", (name: string) => {
        GlobalValues.currDoc.addLayer(new CPLayer2D(GlobalValues.currDoc.width, GlobalValues.currDoc.height, name));
    });

    addToConsole("ls", () => {
        for (let doc of GlobalValues.allDocs) {
            console.log(doc.name);
        }
    })

    addToConsole("tool", {
        pen: new BasicPen(),
        bucket: new PaintBucket()
    })
}

function main() {
    addToConsole("G", GlobalValues);

    let viewCanvas = document.getElementById("viewCanvas") as HTMLCanvasElement;
    if (viewCanvas === null) {
        throw new Error("viewCanvas is null");
    }
    setUnscrollable(viewCanvas);

    viewCanvas.width = 800;
    viewCanvas.height = 600;
    let width = 3200;
    let height = 1800;
    // let layer0 = new BackgroundLayer(width, height, "checkerboard");
    let layer1 = new CPLayer2D(width, height, "Layer 1");
    let layer2 = new CPLayer2D(width, height, "red");
    layer2.ctx.fillStyle = "red";
    layer2.ctx.fillRect(0, 0, width / 2, 10);
    layer2.opacity = 0.2;

    GlobalValues.init(
        viewCanvas,
        new ComboPaintDocument(
            [width, height],
            [layer1, layer2],
            "Document 1"
        ),
        new BasicPen()
    );

    initConsole();
}

main();
console.log("Main.ts loaded");
