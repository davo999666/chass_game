import { configureStore } from "@reduxjs/toolkit";
import chessReducer from "../features/chessSlice.js"; // 👈 adjust the path to where your slice file is
import dragReducer from "../features/dragSlice.js";



const store = configureStore({
    reducer: {
        chess: chessReducer,
        drag: dragReducer,
    },
});

export default store;
