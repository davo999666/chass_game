// Pseudo-moves (no self-check filtering). Used for attack detection + pre-filter.
import { isBlack, isWhite, inBounds } from "../utils/constante.js";

const cache = new Map(); // 🧠 store the last move

// Save last move (called from selectSquare)
export function setLastMove(move) {
    cache.set("lastMove", move);
}

// Get last move
export function getLastMove() {
    return cache.get("lastMove") || null;
}

export function pseudoMovesForPiece(board, r, c, p) {
    const moves = [];
    const colorIsWhite = isWhite(p);
    const sign = colorIsWhite ? -1 : 1;
    const lastMove = getLastMove();

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
            const fwd2 = [r + 2 * sign, c];

            // 1️⃣ Forward 1
            if (inBounds(...fwd1) && !board[fwd1[0]][fwd1[1]]) moves.push(fwd1);

            // 2️⃣ Forward 2 (only from start and both empty)
            if (
                r === startRow &&
                !board[fwd1[0]][fwd1[1]] &&
                inBounds(...fwd2) &&
                !board[fwd2[0]][fwd2[1]]
            ) {
                moves.push(fwd2);
            }

            // 3️⃣ Diagonal captures
            const caps = [
                [r + sign, c - 1],
                [r + sign, c + 1],
            ];
            for (const [nr, nc] of caps) {
                if (!inBounds(nr, nc)) continue;
                const t = board[nr][nc];
                if (t && (colorIsWhite ? isBlack(t) : isWhite(t))) moves.push([nr, nc]);
            }

            // 4️⃣ En passant detection
            if (
                lastMove &&
                lastMove.piece?.toLowerCase() === "p" &&
                Array.isArray(lastMove.fromPos) &&
                Array.isArray(lastMove.toPos)
            ) {
                const [fr, fc] = lastMove.fromPos;
                const [tr, tc] = lastMove.toPos;

                // If last move was a double pawn step
                if (Math.abs(fr - tr) === 2) {
                    // White en passant
                    if (colorIsWhite && r === 3 && tr === 3 && Math.abs(tc - c) === 1) {
                        moves.push([r - 1, tc, { enPassant: true, remove: [r, tc] }]);
                    }
                    // Black en passant
                    if (!colorIsWhite && r === 4 && tr === 4 && Math.abs(tc - c) === 1) {
                        moves.push([r + 1, tc, { enPassant: true, remove: [r, tc] }]);
                    }
                }
            }

            break;
        }

        // ♞ Knight
        case "N": {
            const deltas = [
                [-2, -1],
                [-2, 1],
                [2, -1],
                [2, 1],
                [-1, -2],
                [-1, 2],
                [1, -2],
                [1, 2],
            ];
            for (const [dr, dc] of deltas) addIfValid(r + dr, c + dc);
            break;
        }

        // ♝ Bishop
        case "B": {
            const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
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

        // ♜ Rook
        case "R": {
            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
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

        // ♛ Queen
        case "Q": {
            moves.push(...pseudoMovesForPiece(board, r, c, colorIsWhite ? "R" : "r"));
            moves.push(...pseudoMovesForPiece(board, r, c, colorIsWhite ? "B" : "b"));
            break;
        }

        // ♚ King
        case "K": {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    addIfValid(r + dr, c + dc);
                }
            }
            break;
        }

        default:
            break;
    }

    return moves;
}
