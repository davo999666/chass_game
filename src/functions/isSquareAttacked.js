import {pseudoMovesForPiece} from "./pseudoMovesForPiece.js";
import {WHITE, BLACK, isWhite, isBlack} from "../utils/constante.js";

export function isSquareAttacked(board, targetR, targetC, byColor) {
    // Iterate all opponent pieces and see if any can capture target square
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (!p) continue;
            if (byColor === WHITE && !isWhite(p)) continue;
            if (byColor === BLACK && !isBlack(p)) continue;
            const moves = pseudoMovesForPiece(board, r, c, p, byColor);
            if (moves.some(([mr, mc]) => mr === targetR && mc === targetC)) {
                return true;
            }
        }
    }
    return false;
}