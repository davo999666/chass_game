import { findKing } from "./findKing.js";
// constants
const WHITE = "w";
const BLACK = "b";
import { pseudoMovesForPiece } from "./pseudoMovesForPiece.js";
import { isSquareAttacked } from "./isSquareAttacked.js";
import { cloneBoard, isBlack, isWhite } from "../utils/constante.js";

export function legalMoves(board, fromR, fromC, turn, castling, lastMove) { // ✅ add lastMove param
    const piece = board[fromR][fromC];
    if (!piece) return [];
    if (turn === WHITE && !isWhite(piece)) return [];
    if (turn === BLACK && !isBlack(piece)) return [];

    // ✅ pass lastMove into pseudoMovesForPiece
    const raw = pseudoMovesForPiece(board, fromR, fromC, piece, lastMove);
    const color = isWhite(piece) ? WHITE : BLACK;

    const res = [];
    // ✅ keep the 3rd item ("special") in destructuring
    for (const [toR, toC, special] of raw) {
        const b2 = cloneBoard(board);
        b2[toR][toC] = piece;
        b2[fromR][fromC] = null;

        // ✅ If this move is en passant, remove captured pawn
        if (special?.enPassant && special?.remove) {
            const [remR, remC] = special.remove;
            b2[remR][remC] = null;
        }

        const kingPos = findKing(b2, color);
        if (!kingPos) continue;
        const [kR, kC] = kingPos;

        if (!isSquareAttacked(b2, kR, kC, color === WHITE ? BLACK : WHITE)) {
            res.push([toR, toC, special || null]); // ✅ keep special
        }
    }

    // ♔ Castling logic (same as before)
    if (piece.toUpperCase() === "K") {
        const colorIsWhite = isWhite(piece);
        const homeRow = colorIsWhite ? 7 : 0;
        const enemy = colorIsWhite ? BLACK : WHITE;

        if (fromR === homeRow && fromC === 4 && !isSquareAttacked(board, fromR, fromC, enemy)) {
            const key = colorIsWhite ? "K" : "k";
            if (castling[key]) {
                const empty = !board[homeRow][5] && !board[homeRow][6];
                const rookOk = board[homeRow][7] && (colorIsWhite ? board[homeRow][7] === "R" : board[homeRow][7] === "r");
                const safe5 = !isSquareAttacked(board, homeRow, 5, enemy);
                const safe6 = !isSquareAttacked(board, homeRow, 6, enemy);
                if (empty && rookOk && safe5 && safe6) {
                    res.push([homeRow, 6, { castle: "king" }]);
                }
            }

            const keyQ = colorIsWhite ? "Q" : "q";
            if (castling[keyQ]) {
                const empty = !board[homeRow][3] && !board[homeRow][2] && !board[homeRow][1];
                const rookOk = board[homeRow][0] && (colorIsWhite ? board[homeRow][0] === "R" : board[homeRow][0] === "r");
                const safe3 = !isSquareAttacked(board, homeRow, 3, enemy);
                const safe2 = !isSquareAttacked(board, homeRow, 2, enemy);
                if (empty && rookOk && safe3 && safe2) {
                    res.push([homeRow, 2, { castle: "queen" }]);
                }
            }
        }
    }

    return res;
}
