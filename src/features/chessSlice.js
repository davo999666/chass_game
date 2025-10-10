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
import {handleSelection} from "../functions/handleIlegalSelection.js";
import {setLastMove} from "../functions/pseudoMovesForPiece.js";

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
        flipBoard(state) {
            state.flipped = !state.flipped;
            state.boardView = projectView(state.board, state.flipped);
        },
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
        moveBack(state) {
            if (state.history.length === 0) return;

            const lastMove = state.history.pop();

            const fromCol = lastMove.from.charCodeAt(0) - 97;
            const fromRow = 8 - parseInt(lastMove.from[1], 10);
            const toCol   = lastMove.to.charCodeAt(0) - 97;
            const toRow   = 8 - parseInt(lastMove.to[1], 10);

            // 🧩 restore moved piece
            state.board[fromRow][fromCol] = lastMove.pieceFrom;

            // 🧠 handle special en passant reversal
            if (lastMove.special?.enPassant && lastMove.special?.remove) {
                const [remR, remC] = lastMove.special.remove;
                // bring back the captured pawn
                if (lastMove.captured) {
                    state.board[remR][remC] = lastMove.captured;
                }
                // clear the landing square (since it was empty in en passant)
                state.board[toRow][toCol] = null;
            } else {
                // normal move → restore captured piece (if any)
                state.board[toRow][toCol] = lastMove.captured || null;
            }

            // ♜ restore rook if castling
            if (lastMove.didCastle) {
                const rookFromCol = lastMove.rookFrom.charCodeAt(0) - 97;
                const rookFromRow = 8 - parseInt(lastMove.rookFrom[1], 10);
                const rookToCol   = lastMove.rookTo.charCodeAt(0) - 97;
                const rookToRow   = 8 - parseInt(lastMove.rookTo[1], 10);

                state.board[rookFromRow][rookFromCol] = lastMove.rookPiece;
                state.board[rookToRow][rookToCol] = null;
            }

            // ♟️ flip turn and clear selection
            state.turn = state.turn === WHITE ? BLACK : WHITE;
            state.selected = null;
            state.legal = [];

            // 🔄 refresh board view
            state.boardView = projectView(state.board, state.flipped);
        },


        // Selection + move application (your logic preserved, view refresh unified)
        selectSquare(state, action) {
            const { r, c } = action.payload;
            const piece = state.board[r][c];

            // 🔹 Let handleSelection manage highlights or invalid clicks
            if (handleSelection(state, r, c, piece)) {
                return;
            }
            if (!state.selected) {
                return;
            }

            const { r: fr, c: fc } = state.selected;

            // 🧩 Find move entry (with or without special data)
            const entry = state.legal.find(([lr, lc]) => lr === r && lc === c);
            if (!entry) {
                state.selected = null;
                state.legal = [];
                return;
            }
            // ✅ Extract special (e.g. enPassant)
            const special = entry.length > 2 ? entry[2] : null;

            // 🔹 Normally capture target square
            let capturedPiece = state.board[r][c];

            // ✅ En passant capture — we must check the remove square, not target square
            if (special?.enPassant && special?.remove) {
                const [remR, remC] = special.remove;
                capturedPiece = state.board[remR][remC];
            }

            // ✅ Apply move (includes en passant removal)
            const { newBoard, didCastle, pieceFrom } = applyMove(state, fr, fc, r, c, special);

            // ✅ Update board after move
            state.board = newBoard;

            // ✅ Record notation/history
            const moveNotation = formatMove(
                pieceFrom,
                toAlgebraic(fr, fc),
                toAlgebraic(r, c),
                didCastle ? { castle: c === 6 ? "king" : "queen" } : special
            );

            state.history.push({
                pieceFrom,                // e.g., "K"
                captured: capturedPiece,  // ✅ en passant captures will now show correctly
                from: toAlgebraic(fr, fc),
                to: toAlgebraic(r, c),
                notation: moveNotation,
                display: didCastle ? moveNotation : pieceFrom.toUpperCase() !== "P" ? pieceFrom.toUpperCase() : "",
                fromPos: [fr, fc],
                toPos: [r, c],
                special,
                didCastle,
                rookFrom: didCastle ? (c === 6 ? "h" + (8 - fr) : "a" + (8 - fr)) : null,
                rookTo: didCastle ? (c === 6 ? "f" + (8 - fr) : "d" + (8 - fr)) : null,
                rookPiece: didCastle ? pieceFrom === "K" ? "R" : "r" : null,
            });

            // ✅ Save last move to cache for next en passant
            setLastMove({
                piece: pieceFrom,
                fromPos: [fr, fc],
                toPos: [r, c],
                captured: capturedPiece,
            });

            // ✅ Refresh board view and reset selection
            state.boardView = projectView(state.board, state.flipped);
            state.turn = state.turn === WHITE ? BLACK : WHITE;
            state.selected = null;
            state.legal = [];
        },


    },
});

export const {
    flipBoard,
    changeTurn,
    moveBack,
    toggleBoard,
    placePiece,
    selectSquare,
} = chessSlice.actions;

export default chessSlice.reducer;
