// src/utils/handleDrop.js
import { endDrag } from "../features/dragSlice.js";
import { placePiece, selectSquare } from "../features/chessSlice.js";
import { mapCoords } from "./initialBoard.js";

/**
 * Handle dropping a piece on the board
 */
export const handleDrop = (e, drag, dispatch, boardElement, flipped) => {
    console.log("handleDrop", drag, boardElement, flipped);
    if (!boardElement) return;

    const { left, top, right, bottom, width } = boardElement;

    // If dropped outside the board → cancel
    if (
        e.clientX < left ||
        e.clientX > right ||
        e.clientY < top ||
        e.clientY > bottom
    ) {
        dispatch(endDrag());
        return;
    }

    // Convert screen position → board row/col (UI coords)
    const squareSize = width / 8;
    const uiC = Math.floor((e.clientX - left) / squareSize);
    const uiR = Math.floor((e.clientY - top) / squareSize);

    // Convert UI coords → logic coords (respect flipped state)
    const { r: logicR, c: logicC } = mapCoords(uiR, uiC, 8, flipped);

    if (drag.draggingPiece) {
        if (drag.from) {
            // Moving an existing piece → simulate click from then click to
            dispatch(selectSquare({ r: drag.from.r, c: drag.from.c }));
            dispatch(selectSquare({ r: logicR, c: logicC }));
        } else {
            // Placing a piece from pool (editor/test mode)
            dispatch(placePiece({ r: logicR, c: logicC, piece: drag.draggingPiece }));
        }
    }

    // Always clear drag state
    dispatch(endDrag());
};
