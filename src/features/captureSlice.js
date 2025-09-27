// src/features/captureSlice.js
import { createSlice } from "@reduxjs/toolkit";

const captureSlice = createSlice({
    name: "capture",
    initialState: {
        white: [], // pieces white lost
        black: [], // pieces black lost
    },
    reducers: {
        captureWhite(state, action) {
            // action.payload = piece symbol like "P" or "Q"
            state.white.push(action.payload);
        },
        captureBlack(state, action) {
            state.black.push(action.payload);
        },
        resetCaptures(state) {
            state.white = [];
            state.black = [];
        },
    },
});

export const { captureWhite, captureBlack, resetCaptures } =
    captureSlice.actions;

export default captureSlice.reducer;
