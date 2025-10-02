import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Square from "./Square.jsx";
import DragLayer from "./DragLayer.jsx";
import { moveDrag } from "../features/dragSlice.js";
import {handleDrop} from "../utils/handleDrop.js";

const Board = () => {
    const dispatch = useDispatch();
    const drag = useSelector((s) => s.drag);


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
        handleDrop(e, drag, dispatch, boardElement);
    };

    return (
        <div
            className="
            board-container
            relative
            grid grid-cols-8 grid-rows-8
            w-[320px] h-[320px]        /* default (mobile) */
            sm:w-[480px] sm:h-[480px]  /* small screens */
            md:w-[640px] md:h-[640px]  /* medium (laptop) */
            lg:w-[800px] lg:h-[800px]  /* large desktop */
            shadow-2xl rounded-md
          "
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            {Array.from({ length: 8 }).map((_, r) => (
                <React.Fragment key={r}>
                    {Array.from({ length: 8 }).map((_, c) => (
                        <Square key={`${r}-${c}`} r={r} c={c} />
                    ))}
                </React.Fragment>
            ))}
            {/* floating dragged piece follows cursor */}
            <DragLayer />
        </div>
    );
};

export default Board;
