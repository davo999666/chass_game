import {findKing} from "./findKing.js";
// constants
const WHITE = "w";
const BLACK = "b";
import { pseudoMovesForPiece } from "./pseudoMovesForPiece.js";
import { isSquareAttacked } from "./isSquareAttacked.js";
import {cloneBoard, isBlack, isWhite} from "../utils/constante.js";



export function legalMoves(board, fromR, fromC, turn, castling) {
    const piece = board[fromR][fromC];
    if (!piece) return [];
    if (turn === WHITE && !isWhite(piece)) return [];
    if (turn === BLACK && !isBlack(piece)) return [];

    const raw = pseudoMovesForPiece(board, fromR, fromC, piece, turn);
    const color = isWhite(piece) ? WHITE : BLACK;

    const res = [];
    // Filter self-check
    for (const [toR, toC] of raw) {
        const b2 = cloneBoard(board);
        b2[toR][toC] = piece;
        b2[fromR][fromC] = null;
        const kingPos = findKing(b2, color);
        if (!kingPos) continue;
        const [kR, kC] = kingPos;
        if (!isSquareAttacked(b2, kR, kC, color === WHITE ? BLACK : WHITE)) {
            res.push([toR, toC]);
        }
    }

    // Castling for kings
    if (piece.toUpperCase() === "K") {
        const colorIsWhite = isWhite(piece);
        const homeRow = colorIsWhite ? 7 : 0;
        const enemy = colorIsWhite ? BLACK : WHITE;

        // king must be on home square and not in check
        if (fromR === homeRow && fromC === 4 && !isSquareAttacked(board, fromR, fromC, enemy)) {
            // King side (O-O): squares 5 and 6 empty, rook at 7, rights available, squares not attacked
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
            // Queen side (O-O-O): squares 3,2,1 empty, rook at 0, rights available, squares not attacked
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