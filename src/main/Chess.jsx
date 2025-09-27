import {useDispatch, useSelector} from "react-redux";

import Board from "../components/Board.jsx";
import React from "react";
import {WHITE} from "../utils/constante.js";
import {actions} from "../features/chessSlice.js";


export default function Chess() {
    const turn = useSelector((s) => s.chess.turn);
    const dispatch = useDispatch();
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {/* Board */}
            <Board />

            {/* Info panel */}
            <div className="flex flex-col gap-2">
                <div className="p-3 rounded-lg shadow bg-white/80">
                    <div className="text-xl">
                        {turn === WHITE ? "Turn White" : "Turn Black"}
                    </div>
                </div>
                <button
                    onClick={() => dispatch(actions.resetGame())}
                    className="px-4 py-2 rounded-xl shadow bg-indigo-600 text-white hover:opacity-90"
                >
                    Reset
                </button>
            </div>
        </div>


    );
}
