import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { endDrag, moveDrag, startDrag } from "../features/dragSlice.js";
import { dropPiece, moveBack, reset } from "../features/chessSliceEmpty.js";
import DragLayer from "./DragLayer.jsx";
import PieceImage from "./PieceImageEmpty.jsx";
import { mapCoords } from "../utils/initialBoard.js";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";
import {boardSize} from "../utils/className.js";
import { makeBoardEnd, makeMove, makeStartPiece, makeStartPool,} from "../utils/touchHandlers.js";

function EmptySquare() {
    const dispatch = useDispatch();
    const drag = useSelector((s) => s.drag);
    const board = useSelector((s) => s.chessEmpty.board);
    const flipped = useSelector((s) => s.chessEmpty.flipped);
    const history = useSelector((s) => s.chessEmpty.history);

    const onMouseDown = (piece, r, c,) => (e) => {
        if (e.cancelable) e.preventDefault();
        if (!piece) return;
        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);
        dispatch(
            startDrag({
                piece,
                from: { r: logicR, c: logicC },
                x: e.clientX,
                y: e.clientY,
            })
        );
    };

    // pick up from pool
    const onMouseDownPool = (piece) => (e) => {
        if (e.cancelable) e.preventDefault();
        dispatch(
            startDrag({
                piece,
                from: null,
                x: e.clientX,
                y: e.clientY,
            })
        );
    };


    const handleBoardMouseUp = (e) => {
        if (e.cancelable) e.preventDefault();
        if (!drag.draggingPiece) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const size = rect.width / 8;
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        const r = Math.floor(relY / size);
        const c = Math.floor(relX / size);

        if (r < 0 || r > 7 || c < 0 || c > 7) {
            dispatch(endDrag());
            return;
        }
        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);
        console.log("place", drag.draggingPiece, "from", drag.from, "to", { r: logicR, c: logicC });
        dispatch(
            dropPiece({
                clientX: e.clientX,
                clientY: e.clientY,
                board: { width: rect.width, left: rect.left, top: rect.top },
                drag: { draggingPiece: drag.draggingPiece, from: drag.from },
                flipped,
                target: "board",
                to: { r: logicR, c: logicC },
            })
        );
        dispatch(endDrag());
    };


    const letters = flipped ? ["h","g","f","e","d","c","b","a"] : ["a","b","c","d","e","f","g","h"];
    const numbers = flipped ? ["1","2","3","4","5","6","7","8"] : ["8","7","6","5","4","3","2","1"];

    return (
        <div
            className="flex gap-6 items-center border-4"
            style={{ touchAction: "none" }}
            onTouchMove={makeMove(dispatch, moveDrag)}
        >
            {/* CONTROLS */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => dispatch(reset())}
                    className="px-4 py-2 rounded-xl shadow bg-indigo-600 text-white hover:opacity-90"
                >
                    Reset
                </button>

                <div className="p-3 rounded-lg shadow bg-gray-100 h-40 overflow-y-auto">
                    <h3 className="font-bold mb-2">History</h3>
                    <ul className="space-y-1 text-sm">
                        {history.map((move, index) => (
                            <li key={index}>
                                {index + 1}. {move.pieceFrom} {move.from} → {move.to}
                                {move.captured ? ` (x${move.captured})` : ""}
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
                    onClick={() => dispatch({type: "chessEmpty/flipBoard"})}
                    className="px-4 py-2 rounded-xl shadow bg-gray-600 text-white hover:opacity-90"
                >
                    Flip Board
                </button>

            </div>


            {/* BOARD with coordinates */}
            <div className="relative ">
                {/* Numbers (ranks) on left */}
                <div className=" absolute left-[-20px] top-0 h-full flex flex-col justify-between text-sm font-bold">
                    {numbers.map((n) => (
                        <div key={n} className="h-[12.5%] flex items-center">{n}</div>
                    ))}
                </div>

                <div
                    className={`relative grid grid-cols-8 grid-rows-8 ${boardSize} border-4`}
                    style={{ touchAction: "none" }}
                    onMouseMove={makeMove(dispatch, moveDrag)}
                    onMouseUp={makeBoardEnd(handleBoardMouseUp)}
                    onTouchEnd={makeBoardEnd(handleBoardMouseUp)}

                >
                    {(flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()]).map((r) =>
                        (flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()]).map((c) => {
                            const isDark = (r + c) % 2 === 1;
                            const piece = board[r][c];
                            const {r: logicR, c: logicC} = mapCoords(r, c, board.length, flipped);

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={`flex items-center justify-center w-full h-full
                        ${isDark ? "bg-amber-600" : "bg-amber-100"}`}
                                >
                                    {piece && (
                                        <PieceImage
                                            piece={piece}
                                            // 👇 Mouse drag start
                                            onMouseDown={makeStartPiece(onMouseDown)(piece, r, c)}
                                            onTouchStart={makeStartPiece(onMouseDown)(piece, r, c)}
                                            style={{
                                                touchAction: "none", // 🔑 disable browser gestures
                                                ...(drag.draggingPiece === piece &&
                                                drag.from &&
                                                drag.from.r === logicR &&
                                                drag.from.c === logicC
                                                    ? { visibility: "hidden" }
                                                    : {}),
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })
                    )}
                    <DragLayer/>
                </div>

                {/* Letters (files) at bottom */}
                <div className="absolute bottom-[-20px] left-0 w-full flex justify-between text-sm font-bold">
                    {letters.map((l) => (
                        <div key={l} className="w-[12.5%] text-center">{l}</div>
                    ))}
                </div>
            </div>

            {/* POOLS */}
            <div
                className="flex gap-4 p-2 rounded shadow bg-gray-50"
                style={{ touchAction: "none" }}
                onMouseMove={makeMove(dispatch, moveDrag)}

            >
                <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded">
                    {pieces.map((p) => (
                        <PieceImage
                            style={{ touchAction: "none" }}
                            key={makeWhite(p)}
                            piece={makeWhite(p)}
                            onMouseDown={makeStartPool(onMouseDownPool)(makeWhite(p))}
                            onTouchStart={makeStartPool(onMouseDownPool)(makeWhite(p))}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded">
                    {pieces.map((p) => (
                        <PieceImage
                            style={{ touchAction: "none" }}
                            key={makeBlack(p)}
                            piece={makeBlack(p)}
                            onMouseDown={makeStartPool(onMouseDownPool)(makeBlack(p))}
                            onTouchStart={makeStartPool(onMouseDownPool)(makeBlack(p))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EmptySquare;
