// Pseudo-moves (no self-check filtering). Used for attack detection + pre-filter.
import {isBlack, isWhite, inBounds} from "../utils/constante.js";

export function pseudoMovesForPiece(board, r, c, p) {
    const moves = [];
    const colorIsWhite = isWhite(p);
    const sign = colorIsWhite ? -1 : 1; // pawns: white move up (toward row 0), black down (toward row 7)

    const addIfValid = (nr, nc) => {
        if (!inBounds(nr, nc)) return;
        const target = board[nr][nc];
        if (!target || (colorIsWhite ? isBlack(target) : isWhite(target))) {
            moves.push([nr, nc]);
        }
    };

    switch (p.toUpperCase()) {
        case "P": {
            const startRow = colorIsWhite ? 6 : 1;
            const fwd1 = [r + sign, c];
            if (inBounds(...fwd1) && !board[fwd1[0]][fwd1[1]]) moves.push(fwd1);
            const fwd2 = [r + 2 * sign, c];
            if (r === startRow && !board[fwd1[0]][fwd1[1]] && inBounds(...fwd2) && !board[fwd2[0]][fwd2[1]]) moves.push(fwd2);
            // Captures
            const caps = [ [r + sign, c - 1], [r + sign, c + 1] ];
            for (const [nr, nc] of caps) {
                if (!inBounds(nr, nc)) continue;
                const t = board[nr][nc];
                if (t && (colorIsWhite ? isBlack(t) : isWhite(t))) moves.push([nr, nc]);
            }
            break;
        }
        case "N": {
            const deltas = [
                [-2, -1], [-2, 1], [2, -1], [2, 1],
                [-1, -2], [-1, 2], [1, -2], [1, 2],
            ];
            for (const [dr, dc] of deltas) addIfValid(r + dr, c + dc);
            break;
        }
        case "B": {
            const dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
            for (const [dr, dc] of dirs) {
                let nr = r + dr, nc = c + dc;
                while (inBounds(nr, nc)) {
                    const t = board[nr][nc];
                    if (!t) moves.push([nr, nc]);
                    else {
                        if (colorIsWhite ? isBlack(t) : isWhite(t)) moves.push([nr, nc]);
                        break;
                    }
                    nr += dr; nc += dc;
                }
            }
            break;
        }
        case "R": {
            const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
            for (const [dr, dc] of dirs) {
                let nr = r + dr, nc = c + dc;
                while (inBounds(nr, nc)) {
                    const t = board[nr][nc];
                    if (!t) moves.push([nr, nc]);
                    else {
                        if (colorIsWhite ? isBlack(t) : isWhite(t)) moves.push([nr, nc]);
                        break;
                    }
                    nr += dr; nc += dc;
                }
            }
            break;
        }
        case "Q": {
            // Queen = rook + bishop
            moves.push(...pseudoMovesForPiece(board, r, c, colorIsWhite ? "R" : "r"));
            moves.push(...pseudoMovesForPiece(board, r, c, colorIsWhite ? "B" : "b"));
            break;
        }
        case "K": {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    addIfValid(r + dr, c + dc);
                }
            }
            // Castling squares will be handled separately (needs check filtering)
            break;
        }
        default:
            break;
    }
    return moves;
}
