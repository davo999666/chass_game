import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Square from "./Square.jsx";
import DragLayer from "./DragLayer.jsx";
import { moveDrag, endDrag } from "../features/dragSlice.js";
import {actions} from "../features/chessSlice.js";
import store from "../store/store.js";

const Board = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Prevent selecting text while dragging/clicking rapidly
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

        // find target square based on mouse position
        const squareSize = boardElement.width / 8;
        const toC = Math.floor((e.clientX - boardElement.left) / squareSize);
        const toR = Math.floor((e.clientY - boardElement.top) / squareSize);

        // current dragged piece info from Redux
        const drag = store.getState().drag;
        if (drag.draggingPiece && drag.from) {
            dispatch(
                actions.selectSquare({ r: drag.from.r, c: drag.from.c }) // select origin
            );
            dispatch(actions.selectSquare({ r: toR, c: toC })); // select destination
        }

        dispatch(endDrag());
    };

    return (
        <div
            className="
        relative
        grid grid-cols-8 grid-rows-8
        w-[320px] h-[320px]        /* default (mobile) */
        sm:w-[480px] sm:h-[480px]  /* small screens */
        md:w-[640px] md:h-[640px]  /* medium (laptop) */
        lg:w-[800px] lg:h-[800px]  /* large desktop */
        shadow-2xl rounded-md
      "
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
