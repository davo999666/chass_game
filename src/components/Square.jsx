import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSquare } from "../features/chessSlice.js";
import { startDrag } from "../features/dragSlice.js";
import PieceImage from "./PieceImage.jsx";

import {mapCoords} from "../utils/initialBoard.js";

function Square({ r, c }) {
    const dispatch = useDispatch();
    const piece = useSelector((s) => s.chess.boardView[r][c]);
    const legal = useSelector((s) => s.chess.legal);
    const { from } = useSelector((s) => s.drag);
    const isDraggingHere = from && from.r === r && from.c === c;
    const board = useSelector((s)=> s.chess.boardView)
    const flipped = useSelector((s)=> s.chess.flipped);



    const logicCoords = mapCoords(r, c, board.length, flipped);

    const isLegal = useMemo(
        () => legal.some(([lr, lc]) => lr === logicCoords.r && lc === logicCoords.c),
        [legal, logicCoords, flipped]
    );

    const isDark = (r + c) % 2 === 1;
    const base = isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]";
    const size = board.length;
    const rankLabel = flipped ? r + 1 : size - r;
    const fileLabel = flipped ? "abcdefgh"[size - 1 - c] : "abcdefgh"[c];

    const onPointerDown = (e) => {
        if (!piece) return;
        e.preventDefault();
        const { r: logicR, c: logicC } = mapCoords(r, c, board.length, flipped);
        dispatch(selectSquare({ r: logicR, c: logicC }));
        dispatch(startDrag({ piece, from: { r: logicR, c: logicC }, x: e.clientX, y: e.clientY }));
    };

    return (
        <div className={`relative flex items-center justify-center ${base}`} style={{ touchAction: "none" }}>
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
                <PieceImage piece={piece} onPointerDown={onPointerDown}/>
            )}
        </div>
    );
}

export default Square;
