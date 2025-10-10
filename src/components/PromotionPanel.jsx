import React from "react";
import PieceImage from "./PieceImage.jsx"; // optional if you have this component


function PromotionPanel({ piece, onChoose }) {
    if (!piece) return null;

    const pieces = piece === "P" ? ["Q", "R", "B", "N"] : ["q", "r", "b", "n"];

    return (
        <div className="absolute top-0 left-0 w-full flex justify-center gap-4 p-3 bg-white/90 z-50 shadow-lg">
            {pieces.map((p) => (
                <button
                    key={p}
                    onClick={() => onChoose(p)}
                    className="w-16 h-16 flex items-center justify-center hover:bg-gray-200 rounded-lg"
                >
                    {/* ✅ Use your own piece images or the PieceImage component */}
                    <PieceImage piece={p} size={50} />
                    {/* If you don’t have images, uncomment this line instead:
          <img src={`/pieces/${p}.png`} alt={p} className="w-12 h-12 select-none" />
          */}
                </button>
            ))}
        </div>
    );
}

export default PromotionPanel;
