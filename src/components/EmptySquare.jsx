import React, { useState, useRef } from "react";
import PieceImage from "./PieceImageEmpty.jsx";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";
import { boardSize } from "../utils/className.js";
import { mapCoords } from "../utils/initialBoard.js";

function EmptySquare() {
    const [board, setBoard] = useState(
        Array(8)
            .fill(null)
            .map(() => Array(8).fill(null))
    );
    const [dragging, setDragging] = useState(null); // {piece, from, x, y}
    const [flipped, setFlipped] = useState(false);
    const [history, setHistory] = useState([]);

    const boardRef = useRef(null);
    const dragLayerRef = useRef(null);

    // -------------------------
    // POINTER HANDLERS
    // -------------------------
    const handlePointerDownBoard = (piece, r, c) => (e) => {
        e.preventDefault();
        if (!piece) return;

        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);
        setDragging({
            piece,
            from: { r: logicR, c: logicC },
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handlePointerDownPool = (piece) => (e) => {
        e.preventDefault();
        setDragging({
            piece,
            from: null,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handlePointerMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        setDragging((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    };

    const handlePointerUp = (e) => {
        if (!dragging) return;
        e.preventDefault();

        const rect = boardRef.current.getBoundingClientRect();
        const size = rect.width / 8;
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        const r = Math.floor(relY / size);
        const c = Math.floor(relX / size);

        if (r < 0 || r > 7 || c < 0 || c > 7) {
            setDragging(null);
            return;
        }

        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);

        setBoard((prev) => {
            const newBoard = prev.map((row) => [...row]);
            // Remove from old place
            if (dragging.from) {
                const { r, c } = dragging.from;
                newBoard[r][c] = null;
            }
            // Place to new place
            newBoard[logicR][logicC] = dragging.piece;
            return newBoard;
        });

        // Add to history
        setHistory((prev) => [
            ...prev,
            {
                pieceFrom: dragging.piece,
                from: dragging.from ? `${dragging.from.r},${dragging.from.c}` : "pool",
                to: `${logicR},${logicC}`,
            },
        ]);

        setDragging(null);
    };

    // Reset / MoveBack / Flip Board
    const handleReset = () => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
        setHistory([]);
    };

    const handleMoveBack = () => {
        setHistory((prev) => prev.slice(0, -1));
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    const letters = flipped
        ? ["h", "g", "f", "e", "d", "c", "b", "a"]
        : ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = flipped
        ? ["1", "2", "3", "4", "5", "6", "7", "8"]
        : ["8", "7", "6", "5", "4", "3", "2", "1"];

    // -------------------------
    // RENDER
    // -------------------------
    return (
        <div
            className="flex flex-col md:flex-row items-center md:items-start gap-4"
            style={{ touchAction: "none" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* CONTROLS */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={handleReset}
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
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={handleMoveBack}
                    className="px-4 py-2 rounded-xl shadow bg-gray-600 text-white hover:opacity-90"
                >
                    Move Back
                </button>

                <button
                    onClick={handleFlip}
                    className="px-4 py-2 rounded-xl shadow bg-gray-600 text-white hover:opacity-90"
                >
                    Flip Board
                </button>
            </div>

            {/* BOARD */}
            <div className="relative">
                {/* Numbers (ranks) */}
                <div className="absolute left-[-20px] top-0 h-full flex flex-col justify-between text-sm font-bold">
                    {numbers.map((n) => (
                        <div key={n} className="h-[12.5%] flex items-center">
                            {n}
                        </div>
                    ))}
                </div>

                <div
                    ref={boardRef}
                    className={`relative grid grid-cols-8 grid-rows-8 ${boardSize}`}
                    style={{ touchAction: "none" }}
                >
                    {(flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()]).map((r) =>
                        (flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()]).map((c) => {
                            const isDark = (r + c) % 2 === 1;
                            const piece = board[r][c];
                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={`flex items-center justify-center w-full h-full ${
                                        isDark ? "bg-amber-600" : "bg-amber-100"
                                    }`}
                                >
                                    {piece && (
                                        <PieceImage
                                            piece={piece}
                                            onPointerDown={handlePointerDownBoard(piece, r, c)}
                                            style={{
                                                touchAction: "none",
                                                visibility:
                                                    dragging &&
                                                    dragging.piece === piece &&
                                                    dragging.from?.r === r &&
                                                    dragging.from?.c === c
                                                        ? "hidden"
                                                        : "visible",
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })
                    )}

                    {/* Drag Layer */}
                    {dragging && (
                        <div
                            ref={dragLayerRef}
                            style={{
                                position: "fixed",
                                left: dragging.x - 30,
                                top: dragging.y - 30,
                                pointerEvents: "none",
                            }}
                        >
                            <PieceImage piece={dragging.piece} />
                        </div>
                    )}
                </div>

                {/* Letters (files) */}
                <div className="absolute bottom-[-20px] left-0 w-full flex justify-between text-sm font-bold">
                    {letters.map((l) => (
                        <div key={l} className="w-[12.5%] text-center">
                            {l}
                        </div>
                    ))}
                </div>
            </div>

            {/* POOLS */}
            <div
                className="flex gap-4 p-2 rounded shadow bg-gray-50"
                style={{ touchAction: "none" }}
            >
                {[{ color: "white", make: makeWhite, bg: "bg-gray-100" },
                    { color: "black", make: makeBlack, bg: "bg-gray-200" }].map(
                    ({ color, make, bg }) => (
                        <div key={color} className={`flex flex-col gap-2 ${bg} p-2 rounded`}>
                            {pieces.map((p) => {
                                const piece = make(p);
                                return (
                                    <PieceImage
                                        key={piece}
                                        style={{ touchAction: "none" }}
                                        piece={piece}
                                        onPointerDown={handlePointerDownPool(piece)}
                                    />
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default EmptySquare;
