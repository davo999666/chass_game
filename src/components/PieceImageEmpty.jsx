// src/components/PieceImage.jsx
import React from "react";
import { pieceMap } from "../utils/pieceMap.js";
import {pieceSize} from "../utils/className.js";

function PieceImageEmpty({ piece, onPointerDown, className = "", style, ...rest }) {
    if (!piece) return null;

    return (
        <img
            src={pieceMap[piece]}
            alt={piece}
            onPointerDown={onPointerDown}
            draggable={false}   // stop browser ghost
            onDragStart={(e) => e.preventDefault()}
            style={style}
            className={`${pieceSize} ${className || ""}`}
            {...rest}
        />
    );
}

export default PieceImageEmpty;
