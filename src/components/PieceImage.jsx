// src/components/PieceImage.jsx
import React from "react";
import { pieceMap } from "../utils/pieceMap.js";

function PieceImage({ piece, onMouseDown }) {
    if (!piece) return null;

    return (
        <img
            src={pieceMap[piece]}
            alt={piece}
            onMouseDown={onMouseDown}
            className="
        w-[40px] h-[40px]
        sm:w-[56px] sm:h-[56px]
        md:w-[72px] md:h-[72px]
        lg:w-[88px] lg:h-[88px]
        select-none cursor-grab active:cursor-grabbing
      "
        />
    );
}

export default PieceImage;
