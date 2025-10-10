import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Square from "./Square.jsx";
import DragLayer from "./DragLayer.jsx";
import PromotionPanel from "./PromotionPanel.jsx"; // ✅ import your new component
import { moveDrag } from "../features/dragSlice.js";
import { handleDrop, isPawnPromotion } from "../utils/handleDrop.js";
import { useLocation } from "react-router-dom";
import { toggleBoard } from "../features/chessSlice.js";
import { boardSize } from "../utils/className.js";

const Board = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const drag = useSelector((s) => s.drag);
    const flipped = useSelector((s) => s.chess.flipped);

    const [promotionPanel, setPromotionPanel] = useState(null);

    useEffect(() => {
        const enableRules = location.pathname !== "/testchess";
        dispatch(toggleBoard(enableRules));
    }, [location, dispatch]);

    useEffect(() => {
        document.body.style.userSelect = "none";
        return () => {
            document.body.style.userSelect = "auto";
        };
    }, []);

    const handlePointerMove = (e) => {
        e.preventDefault();
        dispatch(moveDrag({ x: e.clientX, y: e.clientY }));
    };

    const handlePointerUp = (e) => {
        e.preventDefault();
        const boardElement = e.currentTarget.getBoundingClientRect();

        // 🧠 Check for pawn promotion
        if (isPawnPromotion(drag.draggingPiece, e, boardElement, flipped)) {
            setPromotionPanel({
                piece: drag.draggingPiece,
                e,
                boardElement,
            });
            return; // stop here until user picks a piece
        }

        handleDrop(e, drag, dispatch, boardElement, flipped);
    };

    // 🧠 Handle piece selection from PromotionPanel
    const handleChoosePromotion = (chosenPiece) => {
        if (!promotionPanel) return;

        const newDrag = { ...drag, draggingPiece: chosenPiece };
        handleDrop(promotionPanel.e, newDrag, dispatch, promotionPanel.boardElement, flipped);
        setPromotionPanel(null); // close panel
    };

    return (
        <div
            style={{ touchAction: "none" }}
            className={`board-container relative grid grid-cols-8 grid-rows-8 order-2 md:order-3${boardSize}`}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        >
            {/* 🆕 Show promotion panel on top of screen */}
            {promotionPanel && (
                <PromotionPanel
                    piece={promotionPanel.piece}
                    onChoose={handleChoosePromotion}
                />
            )}

            {/* ♟️ Board squares */}
            {Array.from({ length: 8 }).map((_, r) => (
                <React.Fragment key={r}>
                    {Array.from({ length: 8 }).map((_, c) => (
                        <Square key={`${r}-${c}`} r={r} c={c} />
                    ))}
                </React.Fragment>
            ))}

            {/* Floating piece while dragging */}
            <DragLayer />
        </div>
    );
};

export default Board;
