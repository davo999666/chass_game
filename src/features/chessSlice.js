// features/chessSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    deepCopyBoard,
    flipBoardView,
    initialBoard,
    initialEmptyBoard,
} from "../utils/initialBoard.js";
import {WHITE, BLACK, initialCastling} from "../utils/constante.js";
import { formatMove, toAlgebraic } from "../functions/helpers.js";
import { applyMove } from "../functions/applyMove.js";
import {handleSelection, handleSelection1} from "../functions/handleIlegalSelection.js";
import { getPieceInfo } from "../utils/getPieceInfo.js";

// Small helper to keep boardView in sync with flip state
const projectView = (board, flipped) =>
    flipped ? flipBoardView(board) : deepCopyBoard(board);

const chessSlice = createSlice({
    name: "chess",
    initialState: {
        switchBoard: true,
        board: deepCopyBoard(initialBoard),
        boardView: deepCopyBoard(initialBoard),
        turn: WHITE,
        selected: null,     // { r, c } or null
        legal: [],          // array of [r, c]
        castling: { ...initialCastling },
        history: [],
        emptyBoard: initialEmptyBoard,
        flipped: false,
    },
    reducers: {
        // ============ CORE RESETS / TOGGLES ============
        resetGame(state) {
            state.turn = WHITE;
            state.selected = null;
            state.legal = [];
            state.castling = { ...initialCastling };
            state.history = [];
            state.flipped = false; // reset orientation

            // choose which base to reset to (normal or empty) based on switchBoard
            const base = state.switchBoard ? initialBoard : initialEmptyBoard;
            state.board = deepCopyBoard(base);
            state.boardView = projectView(state.board, state.flipped);
        },

        flipBoard(state) {
            state.flipped = !state.flipped;
            state.boardView = projectView(state.board, state.flipped);
        },

        // When true → normal initial board; false → empty board.
        // Also clears selections/history to make UX predictable.
        toggleBoard(state, action) {
            state.switchBoard = !!action.payload;
            const base = state.switchBoard ? initialBoard : initialEmptyBoard;
            state.board = deepCopyBoard(base);
            state.boardView = projectView(state.board, state.flipped);

            state.turn = WHITE;
            state.selected = null;
            state.legal = [];
            state.castling = { ...initialCastling };
            state.history = [];
        },

        changeTurn(state) {
            state.turn = state.turn === WHITE ? BLACK : WHITE;
        },

        // ============ EDITOR HELPERS ============
        placePiece(state, action) {
            const { r, c, piece } = action.payload; // LOGIC coordinates
            state.board[r][c] = piece;
            state.boardView = projectView(state.board, state.flipped);
        },
        placePieceBord(state, action) {
            const { r, c } = action.payload;
            const piece = state.board[r][c];
            if (handleSelection1(state, r, c, piece)) {
                return;
            }

            if (!state.selected) {
                return;
            }
            if (!state.selected && state.board[r][c]) {
                state.selected = { r, c }; console.log("✅ Selected", state.board[r][c], "at", { r, c });
                return;
            }
            const { r: fr, c: fc } = state.selected || {};
            if (!state.selected && state.board[r][c]) {
                state.selected = { r, c };
                return;
            }
            state.board[r][c] = state.board[fr][fc]; state.board[fr][fc] = null; state.selected = null;
            state.boardView = projectView(state.board, state.flipped);
        },
        clearSquare(state, action) {
            const { r, c } = action.payload; // LOGIC coordinates
            state.board[r][c] = null;
            state.boardView = projectView(state.board, state.flipped);
        },

        // ============ GAMEPLAY ============
        // Undo last move (basic version + castling support like your code)
        moveBack(state) {

            if (state.history.length === 0) return;

            const lastMove = state.history.pop();

            const fromCol = lastMove.from.charCodeAt(0) - 97;
            const fromRow = 8 - parseInt(lastMove.from[1], 10);
            const toCol   = lastMove.to.charCodeAt(0) - 97;
            const toRow   = 8 - parseInt(lastMove.to[1], 10);

            // restore king (or moved piece)
            state.board[fromRow][fromCol] = lastMove.pieceFrom;
            state.board[toRow][toCol] = lastMove.captured || null;

            // restore rook if castling
            if (lastMove.didCastle) {
                const rookFromCol = lastMove.rookFrom.charCodeAt(0) - 97;
                const rookFromRow = 8 - parseInt(lastMove.rookFrom[1], 10);
                const rookToCol   = lastMove.rookTo.charCodeAt(0) - 97;
                const rookToRow   = 8 - parseInt(lastMove.rookTo[1], 10);

                state.board[rookFromRow][rookFromCol] = lastMove.rookPiece;
                state.board[rookToRow][rookToCol] = null;
            }

            state.turn = state.turn === WHITE ? BLACK : WHITE;
            state.selected = null;
            state.legal = [];

            // refresh view
            state.boardView = projectView(state.board, state.flipped);
        },

        // Selection + move application (your logic preserved, view refresh unified)
        selectSquare(state, action) {
            const { r, c } = action.payload;
            const piece = state.board[r][c];

            // your external handler may set selection/legals and return true
            if (handleSelection(state, r, c, piece)) {

                return;
            }
            if (!state.selected) {
                return;
            }

            const { r: fr, c: fc } = state.selected;

            // legal move check
            const isLegal = state.legal.some(([lr, lc]) => lr === r && lc === c);
            const special = state.legal.find(([lr, lc, sp]) => lr === r && lc === c && sp);
            if (!isLegal) {
                state.selected = null;
                state.legal = [];
                return;
            }

            const capturedPiece = state.board[r][c]; // capture before apply
            const { newBoard, didCastle, pieceFrom } = applyMove(state, fr, fc, r, c);

            // update board
            state.board = newBoard;

            // record notation/history
            const moveNotation = formatMove(
                pieceFrom,
                toAlgebraic(fr, fc),
                toAlgebraic(r, c),
                didCastle ? { castle: c === 6 ? "king" : "queen" } : special
            );

            state.history.push({
                pieceFrom,                // e.g., "K"
                captured: capturedPiece,  // null if none
                from: toAlgebraic(fr, fc),
                to: toAlgebraic(r, c),
                notation: moveNotation,
                display: didCastle ? moveNotation : getPieceInfo(pieceFrom),

                // extra rook data for undo castling
                didCastle,
                rookFrom: didCastle ? (c === 6 ? "h" + (8 - fr) : "a" + (8 - fr)) : null,
                rookTo:   didCastle ? (c === 6 ? "f" + (8 - fr) : "d" + (8 - fr)) : null,
                rookPiece: didCastle ? (pieceFrom === "K" ? "R" : "r") : null,
            });

            // refresh view
            state.boardView = projectView(state.board, state.flipped);
            state.turn = state.turn === WHITE ? BLACK : WHITE;
            state.selected = null;
            state.legal = [];
        },
    },
});

export const {
    placePieceBord,
    flipBoard,
    changeTurn,
    moveBack,
    resetGame,
    toggleBoard,
    placePiece,
    clearSquare,
    selectSquare,
} = chessSlice.actions;

export default chessSlice.reducer;
