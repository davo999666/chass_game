import { useSelector } from "react-redux";
import { pieceMap } from "../utils/pieceMap.js";
import {pieceSize} from "../utils/className.js";

export default function DragLayer() {
    const { draggingPiece, x, y } = useSelector((s) => s.drag);

    if (!draggingPiece) return null;

    return (
        <img
            src={pieceMap[draggingPiece]}
            draggable={false}   // ✅ stop ghost image here too
            className={`fixed pointer-events-none select-none ${pieceSize}`}
            style={{left: x - 36, top: y - 36}}
            alt="piece"
        />
    );
}
