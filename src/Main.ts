import JustPaintDocument from "./Documents/JustPaintDocument";
import {BasicPen} from "./PaintTools/BasicPen";
import {DocExporter} from "./Utils/DocExporter";
import {addToConsole, downloadUrl, setUnscrollable} from "./Utils/Utils";
import {Preference} from "./Global/Preference";
import {justPaint, JustPaint} from "./Global/JustPaint";
import {JPLayer2D} from "./Layers/JPLayer2D";
import {PaintBucket} from "./PaintTools/PaintBucket";
import {DropdownManager} from "./UserInterfaceManagers/DropdownManager";
import {createShortcut} from "./UserInterfaceManagers/ShortcutManager";
import {globalEvent} from "./Global/GlobalEvent";

function initConsole() {
    addToConsole("GlobalValues", JustPaint);
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
            let url = DocExporter.exportPNG(justPaint.currDoc);
            downloadUrl(url, `${justPaint.currDoc.name}.png`);
            return `Saved ${justPaint.currDoc.name}.png`;
        },
        get psd() {
            let url = DocExporter.exportPSD(justPaint.currDoc);
            let name = justPaint.currDoc.name;
            downloadUrl(url, `${justPaint.currDoc.name}.psd`);
            return `Saved ${name}.psd`;
        }
    })
    addToConsole("currDoc", justPaint.currDoc);
    addToConsole("currLayer", justPaint.currLayer);
    addToConsole("currTool", justPaint.currTool);
    addToConsole("doc.addLayer", (name: string) => {
        justPaint.currDoc.addLayer(new JPLayer2D(justPaint.currDoc.width, justPaint.currDoc.height, name));
    });

    addToConsole("ls", () => {
        for (let doc of justPaint.allDocs) {
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
    addToConsole("G", JustPaint);

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

    justPaint.init(
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
        justPaint.currDoc.undo();
    });

    window.onresize = (e) => {
        resizeDom();
    }
    resizeDom();
}

main();
console.log("Main.ts loaded");

