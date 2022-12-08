import {DocViewer} from "./DocViewer";
import ComboPaintDocument from "./ComboPaintDocument";
import {CPLayer} from "./Layers/CPLayer";
import {BackgroundLayer} from "./Layers/BackgroundLayer";
import {PointerEventHandler} from "./Events/PointerEventHandler";
import {BasicPen} from "./PaintTools/BasicPen";
import {PaintToolEventHandler} from "./Events/PaintToolEventHandler";


function main() {
    let viewCanvas = document.getElementById("viewCanvas") as HTMLCanvasElement;
    viewCanvas.width = 800;
    viewCanvas.height = 600;
    let width = 3000;
    let height = 2000;
    let layer0 = new BackgroundLayer(width, height, "checkerboard");
    let layer1 = new CPLayer(width, height, "Layer 1");
    // layer1.ctx.strokeStyle = "black";
    // layer1.ctx.moveTo(10, 10);
    // layer1.ctx.lineTo(width - 10, height - 10);
    // layer1.ctx.stroke();
    let layer2 = new CPLayer(width, height, "red");
    layer2.ctx.fillStyle = "red";
    layer2.ctx.fillRect(0, 0, width/2, 10);
    layer2.opacity = 0.2;

    console.debug("Creating document");
    console.debug("Adding layers");


    let paintToolEventHandler = new PaintToolEventHandler();
    PointerEventHandler.bindWithElement(paintToolEventHandler, viewCanvas);

    let pen = new BasicPen();


    pen.setLayer(layer1);


    let doc = new ComboPaintDocument(width, height);

    doc.addLayer(layer0);
    doc.addLayer(layer1);
    doc.addLayer(layer2);
    doc.render();

    let docViewer = new DocViewer(viewCanvas, doc);

    pen.doc = doc;
    pen.viewer = docViewer;

    pen.eventHandler = docViewer.paintToolEventHandler;

    docViewer.render();
}

main();
console.log("Main.ts loaded");
