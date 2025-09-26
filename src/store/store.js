import { configureStore } from "@reduxjs/toolkit";
import chessReducer from "../features/chessSlice.js"; // 👈 adjust the path to where your slice file is

const store = configureStore({
    reducer: {
        chess: chessReducer,
    },
});

export default store;
