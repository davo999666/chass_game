// src/components/PiecesPoolBoard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PieceImage from "./PieceImage.jsx";
import { pieces } from "../utils/pieceMap.js";
import { makeBlack, makeWhite } from "../utils/constante.js";
import Board from "./Board.jsx";
import DragLayer from "./DragLayer.jsx";
import { startDrag, moveDrag, endDrag } from "../features/dragSlice.js";
import { handleDrop } from "../utils/handleDrop.js";

function PiecesPoolBoard() {
    const flipped = useSelector((s) => s.chess.flipped);
    const drag = useSelector((s) => s.drag);
    const dispatch = useDispatch();

    useEffect(() => {
        document.body.style.userSelect = "none";
        return () => {
            document.body.style.userSelect = "auto";
        };
    }, []);

    // ✅ Handle global pointer move / up
    useEffect(() => {
        if (!drag.draggingPiece) return;
        const handleMove = (e) => {
            e.preventDefault();
            dispatch(moveDrag({ x: e.clientX, y: e.clientY }));
        };
        const handleUp = (e) => {
            e.preventDefault();
            const boardElement = document.querySelector(".board-container")?.getBoundingClientRect();
            handleDrop(e, drag, dispatch, boardElement, flipped);
            dispatch(endDrag());
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
    }, [drag.draggingPiece, dispatch, flipped, drag]);

    const onPointerDownPool = (piece) => (e) => {
        if (!piece) return;
        e.preventDefault();
        e.stopPropagation();

        dispatch(startDrag({ piece, from: null, x: e.clientX, y: e.clientY }));
    };

    return (
        <div className="flex gap-6 items-center select-none " style={{ touchAction: "none" }}>
            {/* Board */}
            <Board />

            {/* White pool */}
            <div className="order-3 md:order-2 flex flex-row">
            <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded shadow">
                {pieces.map((p) => (
                    <PieceImage
                        key={makeWhite(p)}
                        piece={makeWhite(p)}
                        onPointerDown={onPointerDownPool(makeWhite(p))}
                    />
                ))}
            </div>

            {/* Black pool */}
            <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded shadow">
                {pieces.map((p) => (
                    <PieceImage
                        key={makeBlack(p)}
                        piece={makeBlack(p)}
                        onPointerDown={onPointerDownPool(makeBlack(p))}
                    />
                ))}
            </div>
            </div>
            {/* ✅ Global floating drag image */}
            <DragLayer />
        </div>
    );
}

export default PiecesPoolBoard;
