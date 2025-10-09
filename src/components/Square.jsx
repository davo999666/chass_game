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

    // 🔢 coordinate maps
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];

    // 🔁 Flip board logic coordinates
    const logicCoords = mapCoords(r, c, board.length, flipped);

    const isLegal = useMemo(
        () => legal.some(([lr, lc]) => lr === logicCoords.r && lc === logicCoords.c),
        [legal, logicCoords, flipped]
    );

    const isDark = (r + c) % 2 === 1;
    const base = isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]";

    // ✅ Choose correct label based on orientation
    const letter = flipped ? letters[7 - c] : letters[c];
    const number = flipped ? numbers[7 - r] : numbers[r];

    // ✅ Dynamic position of labels depending on flipped
    const letterPosition = flipped ? "top-[3%] left-[3%]" : "bottom-[3%] right-[3%]";
    const numberPosition = flipped ? "bottom-[3%] right-[3%]" : "top-[3%] left-[3%]";

    // ✅ Handle drag start
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
            {/* 🔠 file letter — bottom-right (or top-left if flipped) */}
            {r === (flipped ? 0 : 7) && (
                <span
                    className={`absolute ${letterPosition} text-[black] select-none pointer-events-none`}
                    style={{
                        fontSize: "calc(1.2vw + 0.2rem)", // responsive text
                    }}
                >
          {letter}
        </span>
            )}

            {/* 🔢 rank number — top-left (or bottom-right if flipped) */}
            {c === (flipped ? 7 : 0) && (
                <span
                    className={`absolute ${numberPosition} text-[black] select-none pointer-events-none`}
                    style={{
                        fontSize: "calc(1.2vw + 0.2rem)",
                    }}
                >
          {number}
        </span>
            )}

            {/* ✅ Legal move indicator */}
            {isLegal && <span className="absolute w-3 h-3 rounded-full bg-black/40" />}

            {/* ✅ Piece */}
            {piece && !isDraggingHere && (
                <PieceImage piece={piece} onPointerDown={onPointerDown} />
            )}
        </div>
    );
}

export default Square;
