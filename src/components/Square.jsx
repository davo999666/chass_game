import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../features/chessSlice.js";
import { unicodeMap } from "../utils/unicodeMap.js"; // or swap to PieceSVG

function Square({ r, c }) {
    const dispatch = useDispatch();
    const piece = useSelector((s) => s.chess.board[r][c]);
    const selected = useSelector((s) => s.chess.selected);
    const legal = useSelector((s) => s.chess.legal);

    const isSelected = selected?.r === r && selected?.c === c;
    const isLegal = useMemo(() => legal.some(([lr, lc]) => lr === r && lc === c), [legal, r, c]);

    const isDark = (r + c) % 2 === 1;
    const base = isDark ? "bg-emerald-700" : "bg-emerald-200";
    const sel = isSelected ? "ring-4 ring-yellow-400" : "";

    // DnD handlers
    const onDragStart = (e) => {
        // select origin square (compute legal moves)
        dispatch(actions.selectSquare({ r, c }));
        e.dataTransfer.setData("text/plain", JSON.stringify({ r, c }));
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e) => {
        e.preventDefault(); // allow dropping here
    };

    const onDrop = (e) => {
        e.preventDefault();
        // try move to this target square
        dispatch(actions.selectSquare({ r, c }));
    };

    const onDragEnd = () => {
        // if drop didn't happen on a square, clear selection
        if (selected) dispatch(actions.deselect());
    };

    // Optional board labels
    const rankLabel = 8 - r;
    const fileLabel = "abcdefgh"[c];
    const coordColor = isDark ? "text-emerald-50/90" : "text-emerald-900/80";

    return (
        <div
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`relative w-16 h-16 flex items-center justify-center ${base} ${sel}`}
            aria-label={`square ${r},${c}${piece ? ` with ${piece}` : ""}`}
        >
            {/* rank/file labels */}
            {c === 0 && (
                <span className={`absolute left-1 top-1 text-[10px] ${coordColor} select-none`}>
          {rankLabel}
        </span>
            )}
            {r === 7 && (
                <span className={`absolute right-1 bottom-1 text-[10px] ${coordColor} select-none`}>
          {fileLabel}
        </span>
            )}

            {/* legal move dot */}
            {isLegal && <span className="absolute w-3 h-3 rounded-full bg-black/40" />}

            {/* DRAGGABLE PIECE (no click) */}
            <span
                draggable={!!piece}
                onDragStart={piece ? onDragStart : undefined}
                onDragEnd={onDragEnd}
                className={`select-none ${piece ? "cursor-grab active:cursor-grabbing text-3xl" : "opacity-0"}`}
            >
        {piece ? unicodeMap[piece] : ""}
      </span>
            {/* If using SVG instead of Unicode, render <PieceSVG ... draggable onDragStart={onDragStart} onDragEnd={onDragEnd} /> */}
        </div>
    );
}

export default Square;
