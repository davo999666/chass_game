// src/features/chessSliceEmpty.js
import { createSlice } from "@reduxjs/toolkit";
import {toAlgebraic} from "../functions/helpers.js";

const deepCopyBoard = (board) => board.map((row) => [...row]);

const initialState = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    history: [],
    flipped: false,
};

const chessSliceEmpty = createSlice({
    name: "chessEmpty",
    initialState,
    reducers: {
        flipBoard(state) {
            state.flipped = !state.flipped;
        },
        dropPiece: (state, action) => {
            const { drag, to, target } = action.payload;
            const moving = drag.draggingPiece;

            if (target === "board") {
                const { r, c } = to;

                // capture if piece exists at target
                const capturedPiece = state.board[r][c];

                // clear old square if moving from board
                if (drag.from) {
                    const { r: fr, c: fc } = drag.from;
                    state.board[fr][fc] = null;
                }

                // place new piece
                state.board[r][c] = moving;

                // ✅ record history
                state.history.push({
                    pieceFrom: moving,
                    captured: capturedPiece || null,
                    from: drag.from ? toAlgebraic(drag.from.r, drag.from.c) : "pool",
                    to: toAlgebraic(r, c),
                    board: deepCopyBoard(state.board), // keep snapshot
                });
            }

            if (target === "pool") {
                // if dragging back to pool, just remove from origin
                if (drag.from) {
                    const { r: fr, c: fc } = drag.from;
                    state.board[fr][fc] = null;
                }

                // ✅ record history for pool drop
                state.history.push({
                    pieceFrom: drag.draggingPiece,
                    captured: null,
                    from: drag.from ? toAlgebraic(drag.from.r, drag.from.c) : "pool",
                    to: "pool",
                });
            }
        },

        reset(state) {
            state.board = Array(8).fill(null).map(() => Array(8).fill(null));
            state.history = [];
        },

        moveBack(state) {
            if (state.history.length > 0) {
                state.history.pop(); // remove last move
                const last = state.history[state.history.length - 1];
                if (last) {
                    // restore board snapshot from last move
                    state.board = deepCopyBoard(last.board);
                } else {
                    // no history left → reset
                    state.board = Array(8).fill(null).map(() => Array(8).fill(null));
                }
            }
        },
    },
});

export const { flipBoard, dropPiece, reset, moveBack } = chessSliceEmpty.actions;
export default chessSliceEmpty.reducer;
