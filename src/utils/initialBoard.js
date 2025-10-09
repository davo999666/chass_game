export const initialBoard = [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"],
];
export const initialEmptyBoard = [
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
];

export const deepCopyBoard = (board) => board.map(row => [...row]);

export const flipBoardView = (board) => {
    return board
        .map(row => [...row])   // copy each row
        .reverse()              // flip vertically
        .map(row => row.reverse()); // flip horizontally
};
// utils/boardUtils.js
export function mapCoords(r, c, boardSize, flipped) {
    if (!flipped) return { r, c };
    return {
        r: boardSize - 1 - r,
        c: boardSize - 1 - c
    };
}
