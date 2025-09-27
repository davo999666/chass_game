import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startDrag } from "../features/dragSlice.js";
import  actions  from "../features/chessSlice.js"; // make sure editorSlice exports actions
import PieceImage from "./PieceImage.jsx";
import {removePiece} from "../features/editorSlice.js";

function TestSquareEditor({ r, c }) {
    const dispatch = useDispatch();

    const piece = useSelector((s) => s.editor.board[r][c]);
    const legal = useSelector((s) => s.chess.legal);
    const { from } = useSelector((s) => s.drag);
    const isDraggingHere = from && from.r === r && from.c === c;

    // ✅ mark as legal if (r,c) is in legal moves
    const isLegal = useMemo(
        () => legal.some(([lr, lc]) => lr === r && lc === c),
        [legal, r, c]
    );

    const isDark = (r + c) % 2 === 1;
    const base = isDark ? "bg-amber-900" : "bg-amber-100";

    const onMouseDown = (e) => {
        if (!piece) return;
        dispatch(startDrag({ piece, from: { r, c }, x: e.clientX, y: e.clientY }));
        dispatch(removePiece({ r, c }));
    };

    return (
        <div className={`relative flex items-center justify-center ${base}`}>
            {isLegal && (
                <span className="absolute w-3 h-3 rounded-full bg-black/40" />
            )}

            {piece && !isDraggingHere && (
                <PieceImage piece={piece} onMouseDown={onMouseDown} />
            )}
            {/* allow clicking empty legal square */}
            {!piece && isLegal && (
                <div className="absolute inset-0" onMouseDown={onMouseDown} />
            )}
        </div>
    );
}

export default TestSquareEditor;
