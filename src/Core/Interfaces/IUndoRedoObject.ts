export interface IUndoRedoObject {
    /**
     * Creates a record of the current state.
     */
    createUndoCheckpoint(): void;

    /**
     * Restores the state to the previous checkpoint
     */
    undo(): void;

    /**
     * Remove the oldest checkpoint
     */
    removeFirstCheckpoint(): void;

    redo(): void;
}
