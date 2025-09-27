import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../features/chessSlice.js";
import { WHITE } from "../utils/constante.js";

function InfoPanel() {
    const dispatch = useDispatch();
    const turn = useSelector((s) => s.chess.turn);

    return (
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
    );
}

export default InfoPanel;
