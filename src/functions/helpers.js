import store from "../store/store.js";

export function toAlgebraic(r, c) {
    const files = "abcdefgh";
    const ranks = "87654321"; // row 0 = rank 8, row 7 = rank 1
    return files[c] + ranks[r];
}

export function formatMove(piece, from, to, special) {
    // Handle castling
    if (special?.castle === "king") return "O-O";
    if (special?.castle === "queen") return "O-O-O";

    // Piece symbol (uppercase, pawns excluded)
    const symbol = piece.toUpperCase() === "P" ? "" : piece.toUpperCase();

    return symbol + to; // Example: Nf3, e4, Kh3
}
export function getLastMove() {
    const state = store.getState();               // ✅ safe outside reducer
    const history = state.chess.history || [];
    return history.length > 0 ? history[history.length - 1] : null;
}
