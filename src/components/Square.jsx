import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSquare, toggleBoard } from "../features/chessSlice.js";
import { startDrag } from "../features/dragSlice.js";
import PieceImage from "./PieceImage.jsx";
import { useLocation } from "react-router-dom";

function Square({ r, c }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const piece = useSelector((s) => s.chess.board[r][c]);
    const legal = useSelector((s) => s.chess.legal);
    const { from } = useSelector((s) => s.drag);
    const isDraggingHere = from && from.r === r && from.c === c;

    useEffect(() => {
        dispatch(toggleBoard(location.pathname !== "/testchess"));
    }, [location, dispatch]);

    const isLegal = useMemo(
        () => legal.some(([lr, lc]) => lr === r && lc === c),
        [legal, r, c]
    );

    const isDark = (r + c) % 2 === 1;
    const base = isDark ? "bg-amber-900" : "bg-amber-100";

    const rankLabel = 8 - r;
    const fileLabel = "abcdefgh"[c];

    const onMouseDown = (e) => {
        if (!piece) return;
        dispatch(selectSquare({ r, c }));
        dispatch(startDrag({ piece, from: { r, c }, x: e.clientX, y: e.clientY }));
    };

    // ✅ Drop handling should be in Board, not Square
    // Keeping only selection/drag start in Square

    return (
        <div className={`relative flex items-center justify-center ${base}`}>
            {c === 0 && (
                <span className="absolute left-1 top-1 text-[20px] text-stone-950 select-none pointer-events-none">
                    {rankLabel}
                </span>
            )}
            {r === 7 && (
                <span className="absolute right-1 bottom-1 text-[20px] text-stone-950 select-none pointer-events-none">
                    {fileLabel}
                </span>
            )}
            {isLegal && <span className="absolute w-3 h-3 rounded-full bg-black/40" />}
            {piece && !isDraggingHere && (
                <PieceImage piece={piece} onMouseDown={onMouseDown} />
            )}
        </div>
    );
}

export default Square;
