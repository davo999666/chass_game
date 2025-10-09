import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {changeTurn, flipBoard, moveBack, toggleBoard} from "../features/chessSlice.js";
import { WHITE } from "../utils/constante.js";


function InfoPanel({location}) {
    const dispatch = useDispatch();
    const turn = useSelector((s) => s.chess.turn);
    const history = useSelector((s) => s.chess.history);
    const isChess = location.toLowerCase() === "chess";

    return (
        <div className="flex flex-col gap-2 order-1 md:order-1">
            <div className="p-3 rounded-lg shadow bg-white/80">
                <button
                    className="text-xl"
                    onClick={() => {
                        dispatch(changeTurn())
                    }}
                >
                    {turn === WHITE ? "Turn White" : "Turn Black"}
                </button>
            </div>
            <button
                onClick={() => dispatch(toggleBoard(isChess))}
                className="px-4 py-2 rounded-xl shadow bg-indigo-600 text-white hover:opacity-90"
            >
                Reset
            </button>
            {/* Show history */}
            <div className="p-3 rounded-lg shadow bg-gray-100 h-40 overflow-y-auto">
                <h3 className="font-bold mb-2">History</h3>
                <ul className="space-y-1 text-sm">
                    {history.map((move, index) => (
                        <li key={index}>
                            {index + 1}. {move.display} {move.piece} {move.from} → {move.to}
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={() => dispatch(moveBack())}
                className="px-4 py-2 rounded-xl shadow bg-gray-600 text-white hover:opacity-90"
            >
                Move Back
            </button>
            <button
                onClick={() => dispatch(flipBoard())}
                className="px-4 py-2 rounded-xl shadow bg-gray-600 text-white hover:opacity-90"
            >
                flip bord
            </button>
        </div>
    );
}

export default InfoPanel;
