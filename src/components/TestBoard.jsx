import { useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { endDrag, moveDrag, startDrag } from "../features/dragSlice.js";
import store from "../store/store.js";
import DragLayer from "./DragLayer.jsx";
import PieceImage from "./PieceImage.jsx";
import TestSquareEditor from "./TestSquareEditor.jsx";
import {placePiece} from "../features/editorSlice.js";
import {actions} from "../features/chessSlice.js";

const pieces = ["K", "Q", "R", "B", "N", "P"]; // King, Queen, Rook, Bishop, Pawn

const TestBoard = () => {
    const dispatch = useDispatch();

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
        const squareSize = boardElement.width / 8;
        const toC = Math.floor((e.clientX - boardElement.left) / squareSize);
        const toR = Math.floor((e.clientY - boardElement.top) / squareSize);

        const drag = store.getState().drag;
        if (drag.draggingPiece) {
            dispatch(placePiece({ r: toR, c: toC, piece: drag.draggingPiece }));
            dispatch(actions.selectSquare({ r: toR, c: toC })); // select destination
        }

        dispatch(endDrag());
    };


    const onMouseDownPool = (piece) => (e) => {
        dispatch(startDrag({piece, from: null, x: e.clientX, y: e.clientY,}));
    };

    return (
        <div className="flex gap-6 items-center">
            {/* White pieces pool (left side) */}
            <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded shadow">
                {pieces.map((p) => (
                    <PieceImage
                        key={p}
                        piece={p} // uppercase = white
                        onMouseDown={onMouseDownPool(p)}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />
                ))}
            </div>

            {/* Chessboard */}
            <div
                className="
          relative
          grid grid-cols-8 grid-rows-8
          w-[320px] h-[320px]
          sm:w-[480px] sm:h-[480px]
          md:w-[640px] md:h-[640px]
          lg:w-[800px] lg:h-[800px]
          shadow-2xl rounded-md
        "
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {Array.from({ length: 8 }).map((_, r) => (
                    <React.Fragment key={r}>
                        {Array.from({ length: 8 }).map((_, c) => (
                            <TestSquareEditor key={`${r}-${c}`} r={r} c={c} />
                        ))}
                    </React.Fragment>
                ))}
                <DragLayer />
            </div>

            {/* Black pieces pool (right side) */}
            <div className="flex flex-col gap-2 p-2 rounded shadow">
                {pieces.map((p) => (
                    <PieceImage
                        key={p}
                        piece={p.toLowerCase()} // lowercase = black
                        onMouseDown={onMouseDownPool(p.toLowerCase())}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestBoard;
