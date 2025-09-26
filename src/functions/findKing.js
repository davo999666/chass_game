import {WHITE} from "../utils/constante.js";

export function findKing(board, color) {
    const target = color === WHITE ? "K" : "k";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === target) return [r, c];
        }
    }
    return null;
}