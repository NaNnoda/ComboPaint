import {CanvasWrapper} from "../CanvasWrapper";
import {CPLayer} from "../Layers/CPLayer";
import {BackgroundLayer} from "../Layers/BackgroundLayer";
import {OffScreenCanvasWrapper2D} from "../OffScreenCanvasWrapper2D";
import {nullLayer} from "../Layers/NullLayer";

export default class ComboPaintDocument extends OffScreenCanvasWrapper2D {
    layers: CPLayer[] = [];
    selectedLayer: CPLayer = nullLayer;

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

    constructor(size: [number, number], layers: CPLayer[] = []) {
        super(size[0], size[1]);

        this.addLayers(...layers);
        // this.background = new BackgroundLayer(width, height, "checkerboard");
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

    render() {
        // this.drawLayer(this.background);
        this.clear();

        for (let layer of this.layers) {
            if (layer.visible) {
                this.drawLayer(layer);
            }
        }
    }

    drawLayer(layer: CPLayer) {
        this.ctx.globalAlpha = layer.opacity;
        this.ctx.globalCompositeOperation = layer.blendMode;
        layer.render();
        this.ctx.drawImage(layer.canvas, 0, 0);
    }

}

