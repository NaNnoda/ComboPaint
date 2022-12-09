import {CanvasWrapper} from "./CanvasWrapper";
import {CPLayer} from "./Layers/CPLayer";
import {BackgroundLayer} from "./Layers/BackgroundLayer";

export default class ComboPaintDocument extends CanvasWrapper {
    layers: CPLayer[] = [];
    background: BackgroundLayer;

    selectedLayer: CPLayer | null = null;

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

    constructor(width: number = 100, height: number = 100) {
        super();
        this.width = width;
        this.height = height;
        this.background = new BackgroundLayer(width, height, "checkerboard");
    }

    addLayer(layer: CPLayer, index: number = this.layers.length) {
        this.layers.splice(index, 0, layer);
        if (this.selectedLayer == null) {
            this.selectedLayer = layer;
        }
    }

    addLayers(...layers: CPLayer[]) {
        for (let layer of layers) {
            this.addLayer(layer);
        }
    }

    render() {
        this.drawLayer(this.background);

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

    toImage() {
        return this.canvas.toDataURL();
    }
}

