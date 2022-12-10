import {DocViewer} from "./DocViewer";
import ComboPaintDocument from "./Document/ComboPaintDocument";
import {CPLayer} from "./Layers/CPLayer";
import {PointerEventHandler} from "./Events/PointerEventHandler";
import {BasicPen} from "./PaintTools/BasicPen";
import {PaintToolEventHandler} from "./Events/PaintToolEventHandler";
import {DocExporter} from "./Utils/DocExporter";
import {addBtnToDom} from "./Utils/DomCreator";
import {addToConsole, downloadUrl} from "./Utils/Utils";
import {Preference} from "./Preference";
import {GlobalValues} from "./GlobalValues";


function main() {
    let viewCanvas = document.getElementById("viewCanvas") as HTMLCanvasElement;
    viewCanvas.width = 800;
    viewCanvas.height = 600;
    let width = 3200;
    let height = 1800;
    // let layer0 = new BackgroundLayer(width, height, "checkerboard");
    let layer1 = new CPLayer(width, height, "Layer 1");
    let layer2 = new CPLayer(width, height, "red");
    layer2.ctx.fillStyle = "red";
    layer2.ctx.fillRect(0, 0, width / 2, 10);
    layer2.opacity = 0.2;

    if (viewCanvas === null) {
        throw new Error("viewCanvas is null");
    }

    GlobalValues.init(
        viewCanvas,
        new ComboPaintDocument(
            [width, height],
            [layer1, layer2]
        ),
        new BasicPen()
    );

    // console.debug("Creating document");
    // console.debug("Adding layers");
    //
    // let paintToolEventHandler = new PaintToolEventHandler();
    // PointerEventHandler.bindWithElement(paintToolEventHandler, viewCanvas);
    //
    // let pen = new BasicPen();
    //
    // pen.setLayer(layer1);
    //
    // let doc = new ComboPaintDocument(width, height);
    //
    // // doc.addLayer(layer0);
    // doc.addLayer(layer1);
    // doc.addLayer(layer2);
    // doc.render();
    //
    // let docViewer = new DocViewer(viewCanvas, doc);
    //
    // pen.doc = doc;
    // pen.viewer = docViewer;
    //
    // pen.eventHandler = docViewer.paintToolEventHandler;
    //
    // docViewer.render();
    //
    // addBtnToDom("export to png", "test", () => {
    //     let url = DocExporter.docToPNG(doc);
    //     downloadUrl(url, "test.png");
    // });
    //
    // addBtnToDom("export to psd", "test", () => {
    //     let url = DocExporter.docToPSD(doc);
    //     downloadUrl(url, "test.psd");
    //
    // });
    //
    // addToConsole("save.png", () => {
    //     let url = DocExporter.docToPNG(doc);
    //     downloadUrl(url, "test.png");
    // });
    //
    // addToConsole("preferences", Preference);
    //
    // addToConsole("localStorage", localStorage);
}

main();
console.log("Main.ts loaded");
