// src/components/PieceImage.jsx
import React from "react";
import { pieceMap } from "../utils/pieceMap.js";
import {pieceSize} from "../utils/className.js";

function PieceImage({ piece, onMouseDown }) {
    if (!piece) return null;

    return (
        <img
            src={pieceMap[piece]}
            alt={piece}
            onMouseDown={onMouseDown}
            draggable={false}   // ✅ stop browser default drag ghost
            className={pieceSize}
        />
    );
}

export default PieceImage;
