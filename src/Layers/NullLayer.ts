import {CPLayer} from "./CPLayer";

export class NullLayer extends CPLayer {
    private static instance: NullLayer | null = null;

    public static getInstance(): NullLayer {
        if (!NullLayer.instance) {
            NullLayer.instance = new NullLayer(1,1, "Null Layer");
        }
        return NullLayer.instance;
    }
}


export const nullLayer = NullLayer.getInstance();
