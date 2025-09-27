// src/features/dragSlice.js
import { createSlice } from "@reduxjs/toolkit";

const dragSlice = createSlice({
    name: "drag",
    initialState: {
        draggingPiece: null, // which piece is being dragged
        from: null,          // {r, c}
        x: 0,
        y: 0,
    },
    reducers: {
        startDrag(state, action) {
            state.draggingPiece = action.payload.piece;
            state.from = action.payload.from;
            state.x = action.payload.x;
            state.y = action.payload.y;
        },
        moveDrag(state, action) {
            state.x = action.payload.x;
            state.y = action.payload.y;
        },
        endDrag(state) {
            state.draggingPiece = null;
            state.from = null;
            state.x = 0;
            state.y = 0;
        },
    },
});

export const { startDrag, moveDrag, endDrag } = dragSlice.actions;
export default dragSlice.reducer;
