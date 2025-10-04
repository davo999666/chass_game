// src/components/PieceImage.jsx
import React from "react";
import { pieceMap } from "../utils/pieceMap.js";
import {pieceSize} from "../utils/className.js";

function PieceImageEmpty({ piece, onMouseDown, className = "", style, ...rest }) {
    if (!piece) return null;

    return (
        <img
            src={pieceMap[piece]}
            alt={piece}
            onMouseDown={onMouseDown}
            draggable={false}   // stop browser ghost
            onDragStart={(e) => e.preventDefault()}
            style={style}
            className={`${pieceSize} ${className || ""}`}
            {...rest}
        />
    );
}

export default PieceImageEmpty;
