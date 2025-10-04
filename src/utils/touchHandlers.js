
export function getEventPoint(e) {
    if (e.touches && e.touches.length > 0) {
        // touchstart / touchmove
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
        // touchend
        return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
    }
    // mouse
    if (typeof e.clientX === "number" && typeof e.clientY === "number") {
        return { clientX: e.clientX, clientY: e.clientY };
    }
    return { clientX: 0, clientY: 0 };
}

// ----------------------
// Start dragging a piece (on board)
// ----------------------
export const makeStartPiece = (onStart) => (piece, r, c) => (e) => {
    const { clientX, clientY } = getEventPoint(e);
    if (!piece) return;
    onStart(piece, r, c)({ clientX, clientY });
};

// ----------------------
// Start dragging from pool
// ----------------------
export const makeStartPool = (onStartPool) => (piece) => (e) => {
    const { clientX, clientY } = getEventPoint(e);
    onStartPool(piece)({ clientX, clientY });
};

// ----------------------
// Move dragging (mouse + touch)
// ----------------------
export const makeMove = (dispatch, moveDrag) => (e) => {
    const { clientX, clientY } = getEventPoint(e);
    dispatch(moveDrag({ x: clientX, y: clientY }));
};

// ----------------------
// Drop on board
// ----------------------
export const makeBoardEnd = (handleBoardUp) => (e) => {
    if (e.cancelable) e.preventDefault();
    const { clientX, clientY } = getEventPoint(e);
    handleBoardUp({
        clientX,
        clientY,
        currentTarget: e.currentTarget,
    });
};

