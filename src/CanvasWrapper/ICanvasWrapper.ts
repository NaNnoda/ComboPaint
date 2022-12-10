export type Canvas = HTMLCanvasElement | OffscreenCanvas;
export type CanvasCtx = CanvasRenderingContext2D | WebGLRenderingContext | OffscreenRenderingContext;

export interface ICanvasWrapper {
    /**
     * Get the width of the element, usually canvas
     */
    get width(): number;

    /**
     * Set the width of the element, usually canvas
     * @param width The new width
     */
    set width(width: number);

    /**
     * Get the height of the element, usually canvas
     */
    get height(): number;

    /**
     * Set the height of the element, usually canvas
     * @param height The new height
     */
    set height(height: number);

    /**
     * Get the canvas element
     */
    get canvas(): Canvas;

    /**
     * Get the context of the canvas element
     */
    get ctx(): CanvasCtx;

    /**
     * Get the dirty state of the canvas
     */
    get isDirty(): boolean;

    /**
     * Set the dirty state of the canvas
     * @param dirty
     */
    set isDirty(dirty: boolean);

    /**
     * Render the canvas
     */
    render(): void;

    /**
     * Safely resize the canvas without losing the content
     * @param width The new width
     * @param height The new height
     * @param offsetX The offset in the x-axis
     * @param offsetY The offset in the y-axis
     */
    resize(width: number, height: number, offsetX: number, offsetY: number): void;
}
