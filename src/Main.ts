import {DocViewer} from "./DocViewer";
import ComboPaintDocument from "./ComboPaintDocument";
import {CPLayer} from "./CPLayer";
import {BackgroundLayer} from "./BackgroundLayer";
import {PointerEventHandler} from "./Events/PointerEventHandler";


function main(){
    let viewCanvas = document.getElementById("viewCanvas") as HTMLCanvasElement;
    let width = 100;
    let height = 100;
    let layer0 = new BackgroundLayer(width, height, "checkerboard");
    let layer1 = new CPLayer(width, height);
    layer1.ctx.strokeStyle = "black";
    layer1.ctx.moveTo(10, 10);
    layer1.ctx.lineTo(width - 10, height - 10);
    layer1.ctx.stroke();
    let layer2 = new CPLayer(width, height);
    layer2.ctx.fillStyle = "red";
    layer2.ctx.fillRect(0, 0, width, height);
    layer2.opacity = 0.2;

    console.debug("Creating document");
    console.debug("Adding layers");

    let pointerHandler = PointerEventHandler.bindWithElement(viewCanvas);


    let doc = new ComboPaintDocument(width, height);
    doc.addLayer(layer0);
    doc.addLayer(layer1);
    doc.addLayer(layer2);
    doc.render();

    let docViewer = new DocViewer(viewCanvas, doc);
    docViewer.render();
}
main();
console.log("Main.ts loaded");