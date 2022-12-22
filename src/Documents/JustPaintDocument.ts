import {JPLayer2D} from "../Layers/JPLayer2D";
import {OffScreenCanvasWrapper2D} from "../CanvasWrappers/OffScreenCanvasWrapper2D";
import {nullLayer} from "../Global/NullLayer";
import {globalEvent} from "../Global/GlobalEvent";
import {IUndoObject} from "../Interfaces/IUndoObject";

export default class JustPaintDocument extends OffScreenCanvasWrapper2D implements IUndoObject {
    layers: JPLayer2D[] = [];
    history: IUndoObject[] = [];
    selectedLayer: JPLayer2D = nullLayer;
    name: string;

    get height() {
        return this.canvas.height;
    }

    set height(height: number) {
        this.canvas.height = height;
    }

    get width() {
        return this.canvas.width;
    }

    set width(width: number) {
        this.canvas.width = width;
    }

    constructor(size: [number, number], layers: JPLayer2D[] = [], name: string) {
        super(size[0], size[1]);
        this.name = name;

        this.addLayers(...layers);

        this.initGlobalEvent();
    }

    initGlobalEvent() {
        globalEvent.registerEvent("docCanvasUpdate", () => {
            this.isDirty = true;
            this.render();
        });

    }

    addLayer(layer: JPLayer2D, index: number = this.layers.length) {
        this.layers.splice(index, 0, layer);
        if (this.selectedLayer == nullLayer) {
            this.selectedLayer = layer;
        }
    }

    addLayers(...layers: JPLayer2D[]) {
        for (let layer of layers) {
            this.addLayer(layer);
        }
        if (this.selectedLayer == null && layers.length > 0) {
            this.selectedLayer = layers[0];
        }
    }

    createUndoCheckpoint() {
        console.log("Creating undo checkpoint");
        for (let layer of this.layers) {
            if (layer.needsCheckpoint) {
                layer.createUndoCheckpoint();
                this.history.push(layer);
            }
        }

        if (this.history.length > 10) {
            this.removeFirstCheckpoint();
        }
    }


    removeFirstCheckpoint(): void {
        if (this.history.length > 0) {
            this.history[0].removeFirstCheckpoint();

            this.history.shift();
        } else {
            console.log("No checkpoints to remove");
        }
    }

    undo() {

        console.log("Undoing on document " + this.name);
        if (this.history.length > 0) {
            console.log("Undoing on layer " + this.history[this.history.length - 1]);
            this.history[this.history.length - 1].undo();
            this.history.pop();

            this.isDirty = true;

            this.render();

            globalEvent.triggerEvent("docCanvasUpdate");
        }

        // for (let layer of this.layers) {
        //     layer.undo();
        // }

    }

    selectLayerByIndex(index: number) {
        if (index < 0 || index >= this.layers.length) {
            // throw new Error("Index out of bounds");
            console.log("Index out of bounds");
            return;
        }
        this.selectedLayer = this.layers[index];
    }

    render() {
        // Don't render if the document is not dirty
        if (!this.isDirty) {
            return;
        }

        // Clear the canvas
        this.clear();

        // Draw the layers
        for (let layer of this.layers) {
            if (layer.visible) {
                this.drawLayer(layer);
            }
        }

        // Mark the document as clean
        this.isDirty = false;
    }

    drawLayer(layer: JPLayer2D) {
        this.ctx.globalAlpha = layer.opacity;
        this.ctx.globalCompositeOperation = layer.blendMode;
        layer.render();
        this.ctx.drawImage(layer.canvas, 0, 0);
    }
}

