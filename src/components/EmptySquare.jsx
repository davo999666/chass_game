import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { endDrag, moveDrag, startDrag } from "../features/dragSlice.js";
import { dropPiece, moveBack, reset } from "../features/chessSliceEmpty.js";
import DragLayer from "./DragLayer.jsx";
import PieceImage from "./PieceImageEmpty.jsx";
import { mapCoords } from "../utils/initialBoard.js";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";

function EmptySquare() {
    const dispatch = useDispatch();
    const drag = useSelector((s) => s.drag);
    const board = useSelector((s) => s.chessEmpty.board);
    const flipped = useSelector((s) => s.chessEmpty.flipped);
    const history = useSelector((s) => s.chessEmpty.history);

    // mouse move while dragging
    const handleMouseMove = (e) => {
        if (drag.draggingPiece) {
            dispatch(moveDrag({ x: e.clientX, y: e.clientY }));
        }
    };

    // pick up from board
    const onMouseDown = (piece, r, c) => (e) => {
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
        dispatch(
            startDrag({
                piece,
                from: null,
                x: e.clientX,
                y: e.clientY,
            })
        );
    };

    const handlePoolMouseUp = (e, color) => {
        if (!drag.draggingPiece) return;
        dispatch(
            dropPiece({
                clientX: e.clientX,
                clientY: e.clientY,
                drag: { draggingPiece: drag.draggingPiece, from: drag.from },
                flipped,
                target: "pool",
                poolColor: color,
            })
        );
        dispatch(endDrag());
    };

    const handleBoardMouseUp = (e) => {
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
        <div className="flex gap-6 items-center">
            {/* CONTROLS */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => dispatch(reset())}
                    className="px-4 py-2 rounded-xl shadow bg-indigo-600 text-white hover:opacity-90"
                >
                    Reset
                </button>

                <button
                    onClick={() => dispatch({ type: "chessEmpty/flipBoard" })}
                    className="px-4 py-2 rounded-xl shadow bg-purple-600 text-white hover:opacity-90"
                >
                    Flip Board
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
            </div>

            {/* BOARD with coordinates */}
            <div className="relative">
                {/* Numbers (ranks) on left */}
                <div className="absolute left-[-20px] top-0 h-full flex flex-col justify-between text-sm font-bold">
                    {numbers.map((n) => (
                        <div key={n} className="h-[12.5%] flex items-center">{n}</div>
                    ))}
                </div>

                <div
                    className="board-container relative grid grid-cols-8 grid-rows-8
        w-[320px] h-[320px]
        sm:w-[480px] sm:h-[480px]
        md:w-[640px] md:h-[640px]
        lg:w-[800px] lg:h-[800px]
        shadow-2xl rounded-md"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleBoardMouseUp}
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
                        ${isDark ? "bg-amber-900" : "bg-amber-100"}`}
                                >
                                    {piece && (
                                        <PieceImage
                                            piece={piece}
                                            onMouseDown={onMouseDown(piece, r, c)}
                                            style={
                                                drag.draggingPiece === piece &&
                                                drag.from &&
                                                drag.from.r === logicR &&
                                                drag.from.c === logicC
                                                    ? {visibility: "hidden"}
                                                    : {}
                                            }
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
                onMouseMove={handleMouseMove}
                onMouseUp={handlePoolMouseUp}
            >
                <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded">
                    {pieces.map((p) => (
                        <PieceImage
                            key={makeWhite(p)}
                            piece={makeWhite(p)}
                            onMouseDown={onMouseDownPool(makeWhite(p))}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded">
                    {pieces.map((p) => (
                        <PieceImage
                            key={makeBlack(p)}
                            piece={makeBlack(p)}
                            onMouseDown={onMouseDownPool(makeBlack(p))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EmptySquare;
