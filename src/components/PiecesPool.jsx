import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import PieceImage from "./PieceImage.jsx";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";
import Board from "./Board.jsx";
import { startDrag, moveDrag } from "../features/dragSlice.js";

import {handleDrop} from "../utils/handleDrop.js";

function PiecesPoolBoard() {
    const dispatch = useDispatch();
    const drag = useSelector((s) => s.drag);

    useEffect(() => {
        document.body.style.userSelect = "none";
        return () => {
            document.body.style.userSelect = "auto";
        };
    }, []);

    const onMouseDownPool = (piece) => (e) => {
        dispatch(startDrag({ piece, from: null, x: e.clientX, y: e.clientY }));
    };

    const handleMouseMove = (e) => {
        dispatch(moveDrag({ x: e.clientX, y: e.clientY }));
    };

    const handleMouseUp = (e) => {
        const boardElement = document
            .querySelector(".board-container")
            ?.getBoundingClientRect();
        handleDrop(e, drag, dispatch, boardElement);
    };


    return (
        <div className="flex gap-6 items-center" onMouseUp={handleMouseUp} >
            {/* White pool */}
            <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded shadow" onMouseMove={handleMouseMove}   >
                {pieces.map((p) => (
                    <PieceImage
                        key={makeWhite(p)}
                        piece={makeWhite(p)}
                        onMouseDown={onMouseDownPool(makeWhite(p))}
                    />
                ))}
            </div>
            {/* Board */}
            <Board />
            {/* Black pool */}
            <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded shadow" onMouseMove={handleMouseMove}>
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
