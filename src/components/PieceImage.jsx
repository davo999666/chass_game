// src/components/PieceImage.jsx
import React from "react";
import { pieceMap } from "../utils/pieceMap.js";
import {pieceSize} from "../utils/className.js";

function PieceImage({ piece, onPointerDown }) {
    if (!piece) return null;

    return (
        <img
            src={pieceMap[piece]}
            alt={piece}
            onPointerDown={onPointerDown}
            draggable={false}   // ✅ stop browser default drag ghost
            className={pieceSize}
        />
    );
}

export default PieceImage;
