// src/features/editorSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { initialEmptyBoard } from "../utils/initialBoard.js";

const editorSlice = createSlice({
    name: "editor",
    initialState: {
        board: initialEmptyBoard
    },
    reducers: {
        placePiece(state, action) {
            const { r, c, piece } = action.payload;
            state.board[r][c] = piece;
        },
        removePiece(state, action) {
            const { r, c } = action.payload;
            state.board[r][c] = null;
        },
        resetEditorBoard() {
            return { board: initialEmptyBoard.map(row => row.slice()) };
        },
    },
});

export const { placePiece, removePiece, resetEditorBoard } = editorSlice.actions; // ✅ export actions
export default editorSlice.reducer;
