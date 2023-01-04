import JustPaintDocument from "./Documents/JustPaintDocument";
import {BasicPen} from "./PaintTools/BasicPen";
import {DocExporter} from "./Utils/DocExporter";
import {addToConsole, downloadUrl, setUnscrollable} from "./Utils/Utils";
import {Preference} from "./Global/Preference";
import {globalVar, JPGlobalVar} from "./Global/JPGlobalVar";
import {JPLayer2D} from "./Layers/JPLayer2D";
import {PaintBucket} from "./PaintTools/PaintBucket";
import {DropdownManager} from "./UserInterfaceManagers/DropdownManager";
import {createShortcut} from "./UserInterfaceManagers/ShortcutManager";
import {globalEvent} from "./Global/JPGlobalEvent";

function initConsole() {
    addToConsole("GlobalValues", JPGlobalVar);
    addToConsole("Preference", Preference);
    // addToConsole("localStorage",localStorage);
    // addToConsole("save.png", (name: string = GlobalValues.currDoc.name) => {
    //     let url = DocExporter.exportPNG(GlobalValues.currDoc);
    //     downloadUrl(url, `${name}.png`);
    // });
    // addToConsole("save.psd", (name: string = GlobalValues.currDoc.name) => {
    //     let url = DocExporter.exportPSD(GlobalValues.currDoc);
    //     downloadUrl(url, `${name}.psd`);
    // });
    addToConsole("save", {
        get png() {
            let url = DocExporter.exportPNG(globalVar.currDoc);
            downloadUrl(url, `${globalVar.currDoc.name}.png`);
            return `Saved ${globalVar.currDoc.name}.png`;
        },
        get psd() {
            let url = DocExporter.exportPSD(globalVar.currDoc);
            let name = globalVar.currDoc.name;
            downloadUrl(url, `${globalVar.currDoc.name}.psd`);
            return `Saved ${name}.psd`;
        }
    })
    addToConsole("currDoc", globalVar.currDoc);
    addToConsole("currLayer", globalVar.currLayer);
    addToConsole("currTool", globalVar.currTool);
    addToConsole("doc.addLayer", (name: string) => {
        globalVar.currDoc.addLayer(new JPLayer2D(globalVar.currDoc.width, globalVar.currDoc.height, name));
    });

    addToConsole("ls", () => {
        for (let doc of globalVar.allDocs) {
            console.log(doc.name);
        }
    })

    addToConsole("tool", {
        pen: new BasicPen(),
        bucket: new PaintBucket()
    })
}

function resizeDom() {
    let viewCanvas = document.getElementById("viewCanvas") as HTMLCanvasElement;
    viewCanvas.width = window.innerWidth;
    viewCanvas.height = window.innerHeight;

    globalEvent.triggerEvent("docCanvasUpdate")
}

function main() {
    addToConsole("G", JPGlobalVar);

    let viewCanvas = document.getElementById("viewCanvas") as HTMLCanvasElement;
    if (viewCanvas === null) {
        throw new Error("viewCanvas is null");
    }
    setUnscrollable(viewCanvas);

    // viewCanvas.width = 800;
    // viewCanvas.height = 600;
    let width = 3840;
    let height = 2160;
    // let layer0 = new BackgroundLayer(width, height, "checkerboard");
    let layer1 = new JPLayer2D(width, height, "Layer 1");
    let layer2 = new JPLayer2D(width, height, "red");
    layer2.ctx.fillStyle = "red";
    layer2.ctx.fillRect(0, 0, width / 2, 10);
    layer2.opacity = 0.2;

    globalVar.init(
        viewCanvas,
        new JustPaintDocument(
            [width, height],
            [layer1, layer2],
            "Document 1"
        ),
        new BasicPen()
    );
    // let dropdownDiv = document.getElementById("dropdown") as HTMLDivElement;
    // let dropdownManager = new DropdownManager(dropdownDiv);
    // dropdownManager.addDropdown("debug", "log", () => {
    //     console.log("layer dropdown");
    // });
    // dropdownManager.addDropdown("debug", "sadsda", () => {
    //     console.log("layer dropdown");
    // });

    initConsole();

    createShortcut("ctrl+z", () => {
        console.log("Undo");
        globalVar.currDoc.undo();
    });

    window.onresize = (e) => {
        resizeDom();
    }
    resizeDom();
}

main();
console.log("Main.ts loaded");

