import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSquare } from "../features/chessSlice.js";
import { startDrag } from "../features/dragSlice.js";
import PieceImage from "./PieceImage.jsx";
import { mapCoords } from "../utils/initialBoard.js";

function Square({ r, c }) {
    const dispatch = useDispatch();
    const piece = useSelector((s) => s.chess.boardView[r][c]);
    const legal = useSelector((s) => s.chess.legal);
    const { from } = useSelector((s) => s.drag);
    const isDraggingHere = from && from.r === r && from.c === c;
    const board = useSelector((s) => s.chess.boardView);
    const flipped = useSelector((s) => s.chess.flipped);

    // 🔠 file letters (columns) and 🔢 rank numbers (rows)
    const letters = flipped
        ? ["h", "g", "f", "e", "d", "c", "b", "a"]
        : ["a", "b", "c", "d", "e", "f", "g", "h"];

    const numbers = flipped
        ? ["1", "2", "3", "4", "5", "6", "7", "8"]
        : ["8", "7", "6", "5", "4", "3", "2", "1"];

    // Logic coords (for move detection)
    const logicCoords = mapCoords(r, c, board.length, flipped);

    const isLegal = useMemo(
        () => legal.some(([lr, lc]) => lr === logicCoords.r && lc === logicCoords.c),
        [legal, logicCoords]
    );

    const isDark = (r + c) % 2 === 1;
    const base = isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]";

    // ✅ Correct label indexes
    const letter = letters[c];
    const number = numbers[r];

    // ✅ Positions (do NOT flip square order, only text corners)
    const letterPosition = "bottom-[3%] right-[3%]";
    const numberPosition = "top-[3%] left-[3%]";

    // ✅ Drag start
    const onPointerDown = (e) => {
        if (!piece) return;
        e.preventDefault();
        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);
        dispatch(selectSquare({ r: logicR, c: logicC }));
        dispatch(
            startDrag({
                piece,
                from: { r: logicR, c: logicC },
                x: e.clientX,
                y: e.clientY,
            })
        );
    };

    return (
        <div
            className={`relative flex items-center justify-center ${base}`}
            style={{ touchAction: "none" }}
        >
            {/* 🔠 file letter — only bottom-right corner */}
            {r === 7 && (
                <span
                    className={`absolute ${letterPosition} text-black select-none pointer-events-none`}
                    style={{ fontSize: "calc(1.2vw + 0.2rem)" }}
                >
          {letter}
        </span>
            )}

            {/* 🔢 rank number — only top-left corner */}
            {c === 0 && (
                <span
                    className={`absolute ${numberPosition} text-black select-none pointer-events-none`}
                    style={{ fontSize: "calc(1.2vw + 0.2rem)" }}
                >
          {number}
        </span>
            )}

            {/* ⚫ Legal move indicator */}
            {isLegal && <span className="absolute w-3 h-3 rounded-full bg-black/40" />}

            {/* ♟️ Piece */}
            {piece && !isDraggingHere && (
                <PieceImage piece={piece} onPointerDown={onPointerDown} />
            )}
        </div>
    );
}

export default Square;
