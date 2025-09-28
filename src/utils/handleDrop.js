// src/utils/handleDrop.js
import { endDrag } from "../features/dragSlice.js";
import { placePiece, selectSquare } from "../features/chessSlice.js";

export const handleDrop = (e, drag, dispatch, boardElement) => {
    if (!boardElement) return;
    const { left, top, right, bottom, width } = boardElement;

    // If dropped outside board
    if (
        e.clientX < left ||
        e.clientX > right ||
        e.clientY < top ||
        e.clientY > bottom
    ) {
        dispatch(endDrag());
        return;
    }

    // Calculate square
    const squareSize = width / 8;
    const toC = Math.floor((e.clientX - left) / squareSize);
    const toR = Math.floor((e.clientY - top) / squareSize);

    if (drag.draggingPiece) {
        if (drag.from) {
            // Move existing piece
            dispatch(selectSquare({ r: drag.from.r, c: drag.from.c }));
            dispatch(selectSquare({ r: toR, c: toC }));
        } else {
            // Place from pool
            dispatch(placePiece({ r: toR, c: toC, piece: drag.draggingPiece }));
        }
    }

    dispatch(endDrag());
};
