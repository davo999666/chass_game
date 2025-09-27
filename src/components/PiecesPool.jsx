import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startDrag, endDrag } from "../features/dragSlice.js";
import { placePiece } from "../features/chessSlice.js";
import PieceImage from "./PieceImage.jsx";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";
import Board from "./Board.jsx";

function PiecesPoolBoard() {
    const dispatch = useDispatch();
    const drag = useSelector((state) => state.drag);

    useEffect(() => {
        document.body.style.userSelect = "none";
        return () => {
            document.body.style.userSelect = "auto";
        };
    }, []);

    const onMouseDownPool = (piece) => (e) => {
        dispatch(startDrag({ piece, from: null, x: e.clientX, y: e.clientY }));
    };

    return (
        <div className="flex gap-6 items-center">
            {/* White pool */}
            <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded shadow">
                {pieces.map((p) => (
                    <PieceImage
                        key={makeWhite(p)}
                        piece={makeWhite(p)}
                        onMouseDown={onMouseDownPool(makeWhite(p))}
                    />
                ))}
            </div>

            <Board/>

            {/* Black pool */}
            <div className="flex flex-col gap-2 p-2 rounded shadow">
                {pieces.map((p) => (
                    <PieceImage
                        key={makeBlack(p)}
                        piece={makeBlack(p)}
                        onMouseDown={onMouseDownPool(makeBlack(p))}
                    />
                ))}
            </div>
        </div>
    );
}

export default PiecesPoolBoard;
