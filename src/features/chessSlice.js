import { createSlice } from "@reduxjs/toolkit";
import { initialBoard, initialEmptyBoard } from "../utils/initialBoard.js";
import { WHITE, BLACK, initialCastling } from "../utils/constante.js";
import { formatMove, toAlgebraic } from "../functions/helpers.js";
import { applyMove } from "../functions/applyMove.js";
import { handleSelection } from "../functions/selection.js";
import { getPieceInfo } from "../utils/getPieceInfo.js";

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
        emptyBoard: initialEmptyBoard,
        flipped: false,
    },
    reducers: {
        flipBoard(state) {
            state.flipped = !state.flipped;
        },
        changeTurn(state) {
            state.turn = state.turn === WHITE ? BLACK : WHITE;
        },
        // ✅ Undo last move
        moveBack(state) {
            if (state.history.length === 0) return;

            const lastMove = state.history.pop();

            const fromCol = lastMove.from.charCodeAt(0) - 97;
            const fromRow = 8 - parseInt(lastMove.from[1], 10);
            const toCol   = lastMove.to.charCodeAt(0) - 97;
            const toRow   = 8 - parseInt(lastMove.to[1], 10);

            // Undo king move
            state.board[fromRow][fromCol] = lastMove.pieceFrom;
            state.board[toRow][toCol] = lastMove.captured || null;

            // ✅ Undo rook move if castling
            if (lastMove.didCastle) {
                const rookFromCol = lastMove.rookFrom.charCodeAt(0) - 97;
                const rookFromRow = 8 - parseInt(lastMove.rookFrom[1], 10);
                const rookToCol   = lastMove.rookTo.charCodeAt(0) - 97;
                const rookToRow   = 8 - parseInt(lastMove.rookTo[1], 10);

                state.board[rookFromRow][rookFromCol] = lastMove.rookPiece;
                state.board[rookToRow][rookToCol] = null;
            }

            // Switch turn back
            state.turn = state.turn === WHITE ? BLACK : WHITE;
            state.selected = null;
            state.legal = [];
        },
        placePiece(state, action) {
            const { r, c, piece } = action.payload;
            state.board[r][c] = piece;
        },

        toggleBoard(state, action) {
            state.switchBoard = action.payload;
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
                const capturedPiece = state.board[r][c]; // ✅ capture BEFORE applyMove
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
                // Save history (letters for logic, display for UI)
                state.history.push({
                    pieceFrom,                // raw letter (king)
                    captured: capturedPiece,  // usually null on castling
                    from: toAlgebraic(fr, fc),
                    to: toAlgebraic(r, c),
                    notation: moveNotation,
                    display: didCastle ? moveNotation : getPieceInfo(pieceFrom), // for UI

                    // ✅ extra rook data for undo castling
                    didCastle,
                    rookFrom: didCastle ? (c === 6 ? "h" + (8 - fr) : "a" + (8 - fr)) : null,
                    rookTo:   didCastle ? (c === 6 ? "f" + (8 - fr) : "d" + (8 - fr)) : null,
                    rookPiece: didCastle ? (pieceFrom === "K" ? "R" : "r") : null,
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
                flipBoard: false,
            };
        },
    },
});

export const {flipBoard, changeTurn, moveBack, resetGame, toggleBoard, placePiece, selectSquare } = chessSlice.actions;
export default chessSlice.reducer;
