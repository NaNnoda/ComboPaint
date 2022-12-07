import {CanvasWrapper} from "./CanvasWrapper";
import {CPLayer} from "./Layers/CPLayer";

export default class ComboPaintDocument extends CanvasWrapper {
    layers: CPLayer[] = [];

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

    constructor(height: number = 100, width: number = 100) {
        super();
        this.width = width;
        this.height = height;
    }

    addLayer(layer: CPLayer, index: number = this.layers.length) {
        this.layers.splice(index, 0, layer);
        if (this.selectedLayer == null) {
            this.selectedLayer = layer;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let layer of this.layers) {
            if (layer.visible) {
                this.ctx.globalAlpha = layer.opacity;
                console.log(this.ctx.globalCompositeOperation);
                this.ctx.globalCompositeOperation = layer.blendMode;
                layer.render();
                this.ctx.drawImage(layer.canvas, 0, 0);
            }
        }
    }

    toImage() {
        return this.canvas.toDataURL();
    }
}

