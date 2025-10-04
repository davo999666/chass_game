import { startDrag, moveDrag } from "../features/dragSlice.js";
import { selectSquare } from "../features/chessSlice.js";
import { handleDrop } from "./handleDrop.js";
import { mapCoords } from "./initialBoard.js";
import { makeStartPiece, makeStartPool, makeMove, makeBoardEnd } from "./touchHandlers.js"; // 👈 your helper

export const createDragHandlers = ({ dispatch, drag, flipped, board, piece, r, c }) => {
    // ----------------------
    // Start dragging from board
    // ----------------------
    const onStartBoardPiece = (piece, r, c) => ({ clientX, clientY }) => {
        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);
        dispatch(selectSquare({ r: logicR, c: logicC }));
        dispatch(startDrag({ piece, from: { r: logicR, c: logicC }, x: clientX, y: clientY }));
    };

    // ----------------------
    // Start dragging from pool
    // ----------------------
    const onStartPoolPiece = (piece) => ({ clientX, clientY }) => {
        dispatch(startDrag({ piece, from: null, x: clientX, y: clientY }));
    };

    // ----------------------
    // Move handler
    // ----------------------
    const handleMove = makeMove(dispatch, moveDrag);

    // ----------------------
    // Drop handler
    // ----------------------
    const handleBoardUp = ({ clientX, clientY, currentTarget }) => {
        const boardElement = currentTarget?.getBoundingClientRect();
        if (!boardElement) return;
        handleDrop({ clientX, clientY }, drag, dispatch, boardElement, flipped);
    };

    const handleBoardEnd = makeBoardEnd(handleBoardUp);

    return {
        onMouseDown: makeStartPiece(onStartBoardPiece)(piece, r, c),
        onTouchStart: makeStartPiece(onStartBoardPiece)(piece, r, c),
        onMouseDownPool: makeStartPool(onStartPoolPiece),
        onTouchStartPool: makeStartPool(onStartPoolPiece),
        handleMouseMove: handleMove,
        handleTouchMove: handleMove,
        handleMouseUp: handleBoardEnd,
        handleTouchEnd: handleBoardEnd,
    };
};
