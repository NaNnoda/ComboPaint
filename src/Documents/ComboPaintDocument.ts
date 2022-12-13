import {CPLayer} from "../Layers/CPLayer";
import {OffScreenCanvasWrapper2D} from "../CanvasWrappers/OffScreenCanvasWrapper2D";
import {nullLayer} from "../Layers/NullLayer";

export default class ComboPaintDocument extends OffScreenCanvasWrapper2D {
    layers: CPLayer[] = [];
    selectedLayer: CPLayer = nullLayer;
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

    constructor(size: [number, number], layers: CPLayer[] = [], name: string) {
        super(size[0], size[1]);
        this.name = name;

        this.addLayers(...layers);
    }

    addLayer(layer: CPLayer, index: number = this.layers.length) {
        this.layers.splice(index, 0, layer);
        if (this.selectedLayer == nullLayer) {
            this.selectedLayer = layer;
        }
    }

    addLayers(...layers: CPLayer[]) {
        for (let layer of layers) {
            this.addLayer(layer);
        }
        if (this.selectedLayer == null && layers.length > 0) {
            this.selectedLayer = layers[0];
        }
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

    drawLayer(layer: CPLayer) {
        this.ctx.globalAlpha = layer.opacity;
        this.ctx.globalCompositeOperation = layer.blendMode;
        layer.render();
        this.ctx.drawImage(layer.canvas, 0, 0);
    }
}

