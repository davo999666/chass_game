export const WHITE = "w";
export const BLACK = "b";
export const isWhite = (p) => p && p === p.toUpperCase();
export const isBlack = (p) => p && p === p.toLowerCase();
export const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
export const makeWhite = (piece) => piece.toUpperCase();
export const makeBlack = (piece) => piece.toLowerCase();

export const cloneBoard = (b) => b.map((row) => row.slice());

// Castling rights: KQkq (white: king/queen side, black: king/queen side)
export const initialCastling = { K: true, Q: true, k: true, q: true };

