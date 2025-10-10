import React, { useState, useRef } from "react";
import PieceImage from "./PieceImageEmpty.jsx";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";
import { boardSize } from "../utils/className.js";
import {initialEmptyBoard, mapCoords} from "../utils/initialBoard.js";

function EmptySquare() {
    const [board, setBoard] = useState(initialEmptyBoard);
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

        const boardEl = boardRef.current;
        const rect = boardEl.getBoundingClientRect();
        const boardHeight = boardEl.clientHeight;
        const boardWidth = boardEl.clientWidth;

        // Pointer position
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        // 🧱 Check if dropped outside board
        const outside =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom;

        if (outside) {
            // 🗑️ If dropped outside → remove piece completely
            setBoard((prev) => {
                const newBoard = prev.map((row) => [...row]);
                if (dragging.from) {
                    const { r, c } = dragging.from;
                    newBoard[r][c] = null;
                }
                return newBoard;
            });

            // Save that in history (optional)
            setHistory((prev) => [
                ...prev,
                {
                    pieceFrom: dragging.piece,
                    from: dragging.from ? `${dragging.from.r},${dragging.from.c}` : "pool",
                    to: "outside",
                    removed: true,
                },
            ]);

            setDragging(null);
            return; // stop here
        }

        // 🧮 Continue normal logic (inside board)
        const percentX = relX / boardWidth;
        const percentY = relY / boardHeight;

        let c = Math.floor(percentX * 8);
        let r = Math.floor(percentY * 8);
        r = Math.max(0, Math.min(7, r));
        c = Math.max(0, Math.min(7, c));

        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);

        // Get target square before moving (capture detection)
        const targetPiece = board[logicR][logicC];

        // Detect promotion
        const isWhitePromotion = dragging.piece === "P" && logicR === 0;
        const isBlackPromotion = dragging.piece === "p" && logicR === 7;
        let newPiece = dragging.piece;

        if (isWhitePromotion || isBlackPromotion) {
            newPiece = dragging.piece === "P" ? "Q" : "q";
        }

        // 🧩 Update board
        setBoard((prev) => {
            const newBoard = prev.map((row) => [...row]);
            if (dragging.from) {
                const { r, c } = dragging.from;
                newBoard[r][c] = null;
            }
            newBoard[logicR][logicC] = newPiece;
            return newBoard;
        });

        // 🧩 Save move info
        setHistory((prev) => [
            ...prev,
            {
                pieceFrom: dragging.piece,
                promotedTo: newPiece !== dragging.piece ? newPiece : null,
                from: dragging.from ? `${dragging.from.r},${dragging.from.c}` : "pool",
                to: `${logicR},${logicC}`,
                captured: targetPiece || null,
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
        setHistory((prevHistory) => {
            if (prevHistory.length === 0) return prevHistory;

            const lastMove = prevHistory[prevHistory.length - 1];
            const { pieceFrom, promotedTo, captured, from, to, removed } = lastMove;

            // Special case: piece was dropped outside → restore it
            if (removed) {
                setBoard((prevBoard) => {
                    const newBoard = prevBoard.map((row) => [...row]);
                    // Restore piece back to its original square
                    if (from && from !== "pool") {
                        const [r, c] = from.split(",").map(Number);
                        newBoard[r][c] = pieceFrom;
                    }
                    return newBoard;
                });

                return prevHistory.slice(0, -1);
            }

            // Normal undo logic
            const [toR, toC] = to.split(",").map(Number);
            const [fromR, fromC] =
                from === "pool" ? [null, null] : from.split(",").map(Number);

            setBoard((prevBoard) => {
                const newBoard = prevBoard.map((row) => [...row]);

                // Clear destination square
                newBoard[toR][toC] = null;

                // 🧠 Restore captured piece if it existed
                if (captured) {
                    newBoard[toR][toC] = captured;
                }

                // 🧠 Restore pawn if it was a promotion
                if (promotedTo) {
                    if (fromR !== null && fromC !== null) {
                        newBoard[fromR][fromC] = pieceFrom; // e.g. "P" or "p"
                    }
                } else if (fromR !== null && fromC !== null) {
                    // Regular move
                    newBoard[fromR][fromC] = pieceFrom;
                }

                return newBoard;
            });

            // Remove move from history
            return prevHistory.slice(0, -1);
        });
    };




    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];

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
                <div
                    ref={boardRef}
                    className={`relative grid grid-cols-8 grid-rows-8 ${boardSize}`}
                    style={{ touchAction: "none" }}
                >
                    {(flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()]).map((r) =>
                            (flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()]).map((c) => {
                                const isDark = (r + c) % 2 === 1;
                                const piece = board[r][c];
                                const letter = letters[c];
                                const number = numbers[r];
                                const placeLetter = flipped ? "left-[3%] top-[3%]":"right-[3%] bottom-[3%]";
                                const placeNumber = flipped ? "right-[3%] bottom-[3%]":"left-[3%] top-[3%]";

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`relative flex items-center justify-center w-full h-full ${
                                            isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]"
                                        }`}
                                    >
                                        {/* ♟️ piece */}
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

                                        {/* 🔠 file letter — bottom-right corner */}
                                        {r === 7 && (
                                            <span
                                                className={`absolute ${placeLetter} select-none pointer-events-none text-[black]`}
                                                style={{
                                                    fontSize: "calc(1.2vw + 0.2rem)", // scales with viewport width and base font size
                                                }}
                                            >
                                        {letter}
                                        </span>
                                        )}

                                        {/* 🔢 rank number — top-left corner */}
                                        {c === 0 && (
                                            <span
                                                className={`absolute ${placeNumber} select-none pointer-events-none text-[black]`}
                                                style={{
                                                    fontSize: "calc(1.2vw + 0.2rem)",
                                                }}
                                            >
                                        {number}
                                        </span>
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
