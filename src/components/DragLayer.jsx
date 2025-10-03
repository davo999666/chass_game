import { useSelector } from "react-redux";
import { pieceMap } from "../utils/pieceMap.js";

export default function DragLayer() {
    const { draggingPiece, x, y } = useSelector((s) => s.drag);

    if (!draggingPiece) return null;

    return (
        <img
            src={pieceMap[draggingPiece]}
            draggable={false}   // ✅ stop ghost image here too
            className="
    fixed pointer-events-none select-none
    w-[40px] h-[40px]
    sm:w-[56px] sm:h-[56px]
    md:w-[72px] md:h-[72px]
    lg:w-[88px] lg:h-[88px]
  "
            style={{left: x - 36, top: y - 36}}
            alt="piece"
        />
    );
}
