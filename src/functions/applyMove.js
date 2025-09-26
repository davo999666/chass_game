import {cloneBoard} from "../utils/constante.js";

export function applyMove(state, fr, fc, r, c) {
    const pieceFrom = state.board[fr][fc];
    const newBoard = cloneBoard(state.board);
    let didCastle = false;

    // --- White castling ---
    if (pieceFrom === "K" && fr === 7 && fc === 4) {
        if (r === 7 && c === 6) { // O-O
            newBoard[7][6] = "K"; newBoard[7][4] = null;
            newBoard[7][5] = newBoard[7][7]; newBoard[7][7] = null;
            state.castling.K = false; state.castling.Q = false;
            didCastle = true;
        } else if (r === 7 && c === 2) { // O-O-O
            newBoard[7][2] = "K"; newBoard[7][4] = null;
            newBoard[7][3] = newBoard[7][0]; newBoard[7][0] = null;
            state.castling.K = false; state.castling.Q = false;
            didCastle = true;
        }
    }

    // --- Black castling ---
    if (pieceFrom === "k" && fr === 0 && fc === 4) {
        if (r === 0 && c === 6) { // O-O
            newBoard[0][6] = "k"; newBoard[0][4] = null;
            newBoard[0][5] = newBoard[0][7]; newBoard[0][7] = null;
            state.castling.k = false; state.castling.q = false;
            didCastle = true;
        } else if (r === 0 && c === 2) { // O-O-O
            newBoard[0][2] = "k"; newBoard[0][4] = null;
            newBoard[0][3] = newBoard[0][0]; newBoard[0][0] = null;
            state.castling.k = false; state.castling.q = false;
            didCastle = true;
        }
    }

    // --- Normal move ---
    if (!didCastle) {
        newBoard[r][c] = pieceFrom;
        newBoard[fr][fc] = null;
    }

    return { newBoard, didCastle, pieceFrom };
}
