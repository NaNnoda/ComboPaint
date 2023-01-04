
import {JPLayer2D} from "../Layers/JPLayer2D";

export class NullLayer extends JPLayer2D {
    private static instance: NullLayer | null = null;

    public static getInstance(): NullLayer {
        if (!NullLayer.instance) {
            NullLayer.instance = new NullLayer(1,1, "Null Layer");
        }
        return NullLayer.instance;
    }

    render(): void {
    }

    resize(width: number, height: number, offsetX: number, offsetY: number): void {
    }
}


export const nullLayer = NullLayer.getInstance();
