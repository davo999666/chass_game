export function getPieceInfo(letter) {
    if (!letter) return null;

    const isUpper = letter === letter.toUpperCase();
    const color = isUpper ? "White" : "Black";

    const pieceMap = {
        K: "King",
        Q: "Queen",
        R: "Rook",
        B: "Bishop",
        N: "Knight",
        P: "Pawn",
    };

    const name = pieceMap[letter.toUpperCase()] || "Unknown";

    return  `${color} ${name}` ;
}








