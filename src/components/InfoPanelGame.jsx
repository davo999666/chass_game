import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {changeTurn, flipBoard, moveBack, resetGame} from "../features/chessSlice.js";
import {WHITE} from "../utils/constante.js";

function InfoPanelGame() {
    const dispatch = useDispatch();
    const turn = useSelector((s) => s.chess.turn);
    const history = useSelector((s) => s.chess.history);
    const board = useSelector((s) => s.chess.board);
    const boardView = useSelector((s) => s.chess.boardView);



    return (
        <div className="flex flex-col gap-2">
            <div className="p-3 rounded-lg shadow bg-white/80">
                <div
                    className="text-xl"
                    onClick={() => {dispatch(changeTurn())}}
                >
                    {turn === WHITE ? "Turn White" : "Turn Black"}
                </div>
            </div>

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
                onClick={() => dispatch(resetGame())}
                className="px-4 py-2 rounded-xl shadow bg-indigo-600 text-white hover:opacity-90"
            >
                Reset
            </button>
            <button
                onClick={() => dispatch(moveBack())}
                className="px-4 py-2 rounded-xl shadow bg-gray-600 text-white hover:opacity-90"
            >
                Move Back
            </button>
            <div className="p-3 rounded-lg shadow bg-gray-100 font-mono text-sm">
                <h3 className="font-bold mb-2">Board</h3>
                <pre>
                {board.map((row) =>
                    row.map(cell => cell || ".").join(" ") + " ").join("\n")}
               </pre>

            </div>
            <button
                onClick={() => dispatch(flipBoard())}
                className="px-4 py-2 rounded-xl shadow bg-gray-600 text-white hover:opacity-90"
            >
                flip bord
            </button>
            <div className="p-3 rounded-lg shadow bg-gray-100 font-mono text-sm">
                <h3 className="font-bold mb-2">Board</h3>
                <pre>
                {boardView.map((row) =>
                    row.map(cell => cell || ".").join(" ") + " ").join("\n")}
               </pre>

            </div>
        </div>
    );
}


export default InfoPanelGame;
