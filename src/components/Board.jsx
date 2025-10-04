import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import Square from "./Square.jsx";
import DragLayer from "./DragLayer.jsx";
import { moveDrag } from "../features/dragSlice.js";
import {handleDrop} from "../utils/handleDrop.js";
import {useLocation} from "react-router-dom";
import {toggleBoard} from "../features/chessSlice.js";
import {boardSize} from "../utils/className.js";

const Board = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const drag = useSelector((s) => s.drag);
    const flipped = useSelector((s)=>s.chess.flipped)

    useEffect(() => {
        const enableRules =
            location.pathname !== "/testchess";
        dispatch(toggleBoard(enableRules));
    }, [location, dispatch]);

    useEffect(() => {
        document.body.style.userSelect = "none";
        return () => {
            document.body.style.userSelect = "auto";
        };
    }, []);

    const handleMouseMove = (e) => {
        dispatch(moveDrag({ x: e.clientX, y: e.clientY }));
    };

    const handleMouseUp = (e) => {
        const boardElement = e.currentTarget.getBoundingClientRect();
        handleDrop(e, drag, dispatch, boardElement, flipped); // 👈 pass flipped
    };

    return (
        <div
            className={`board-container relative grid grid-cols-8 grid-rows-8 ${boardSize}`}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            {Array.from({ length: 8 }).map((_, r) => (
                <React.Fragment key={r}>
                    {Array.from({ length: 8 }).map((_, c) =>
                                <Square key={`${r}-${c}`} r={r} c={c} />
                    )}
                </React.Fragment>
            ))}
            {/* floating dragged piece follows cursor */}
            <DragLayer />
        </div>
    );
};

export default Board;
