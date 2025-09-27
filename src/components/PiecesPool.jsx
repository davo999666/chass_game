import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import PieceImage from "./PieceImage.jsx";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";
import Board from "./Board.jsx";
import { startDrag, endDrag, moveDrag } from "../features/dragSlice.js";
import {placePiece, selectSquare} from "../features/chessSlice.js";

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
        if (!boardElement) return;

        const { left, top, right, bottom, width } = boardElement;

        // If drop is outside board → ignore
        if (
            e.clientX < left ||
            e.clientX > right ||
            e.clientY < top ||
            e.clientY > bottom
        ) {
            console.log("Dropped outside → ignore");
            dispatch(endDrag());
            return;
        }

        // Compute row/col inside the board
        const squareSize = width / 8;
        const toC = Math.floor((e.clientX - left) / squareSize);
        const toR = Math.floor((e.clientY - top) / squareSize);

        if (drag.draggingPiece && drag.from) {
            // 🟢 Case 1: Moving a piece already on the board
            console.log("Legal move flow");
            dispatch(selectSquare({ r: drag.from.r, c: drag.from.c })); // origin
            dispatch(selectSquare({ r: toR, c: toC }));                 // destination
        } else if (drag.draggingPiece || drag.piece) {
            // 🔵 Case 2: Dropping from pool directly
            console.log("Direct place flow");
            const piece = drag.draggingPiece || drag.piece;
            dispatch(placePiece({ r: toR, c: toC, piece }));
        }

        dispatch(endDrag());
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
