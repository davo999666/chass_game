import { createSlice } from "@reduxjs/toolkit";
import {initialBoard, initialEmptyBoard} from "../utils/initialBoard.js";
import { WHITE, BLACK, initialCastling } from "../utils/constante.js";
import { formatMove, toAlgebraic } from "../functions/helpers.js";
import { applyMove } from "../functions/applyMove.js";
import { handleSelection } from "../functions/selection.js";

const chessSlice = createSlice({
    name: "chess",
    initialState: {
        switchBoard: true,
        board: initialBoard,
        turn: WHITE, // white starts
        selected: null, // { r, c }
        legal: [], // array of [r,c]
        castling: initialCastling,
        history: [],
        emptyBoard:initialEmptyBoard
    },
    reducers: {
        placePiece(state, action) {
            const { r, c, piece } = action.payload;
            state.board[r][c] = piece;
        },
        toggleBoard(state, action) {
            state.switchBoard = action.payload; // true = normal, false = empty
            state.board = state.switchBoard ? initialBoard : initialEmptyBoard;
        },
        selectSquare(state, action) {
            const { r, c } = action.payload;
            const piece = state.board[r][c];
            if (handleSelection(state, r, c, piece)) {
                return; // selection handled
            }
            if (!state.selected) {
                return;
            }
            const { r: fr, c: fc } = state.selected;
            // Check if move is legal
            const isLegal = state.legal.some(([lr, lc]) => lr === r && lc === c);
            const special = state.legal.find(([lr, lc, sp]) => lr === r && lc === c && sp);
            if (isLegal) {
                const { newBoard, didCastle, pieceFrom } = applyMove(state, fr, fc, r, c);
                // Update board
                state.board = newBoard;
                // Save notation
                const moveNotation = formatMove(
                    pieceFrom,
                    toAlgebraic(fr, fc),
                    toAlgebraic(r, c),
                    didCastle ? { castle: c === 6 ? "king" : "queen" } : special
                );
                state.history.push({
                    piece: pieceFrom,
                    from: toAlgebraic(fr, fc),
                    to: toAlgebraic(r, c),
                    notation: moveNotation,
                });
                // Switch turn
                state.turn = state.turn === WHITE ? BLACK : WHITE;
                state.selected = null;
                state.legal = [];
            } else {
                // Clear selection if illegal
                state.selected = null;
                state.legal = [];
            }
        },
        resetGame() {
            return {
                board: initialBoard.map((row) => row.slice()),
                turn: WHITE,
                selected: null,
                legal: [],
                castling: { ...initialCastling },
                history: [],
            };
        },
    },
});

export const { actions, reducer ,toggleBoard,placePiece, selectSquare} = chessSlice.actions;
export default chessSlice.reducer;
