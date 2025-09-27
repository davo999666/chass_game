import { useSelector } from "react-redux";
import { pieceMap } from "../utils/pieceMap.js";

function CapturedPanel() {
    const capturedWhite = useSelector((s) => s.capture.white);
    const capturedBlack = useSelector((s) => s.capture.black);

    return (
        <div className="flex justify-between w-full max-w-[800px] px-4 mt-4">
            {/* White captured */}
            <div className="flex gap-1 bg-gray-100 p-2 rounded shadow">
                {capturedWhite.map((p, i) => (
                    <img
                        key={i}
                        src={pieceMap[p]}
                        alt={p}
                        className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                ))}
            </div>

            {/* Black captured */}
            <div className="flex gap-1 bg-gray-800 p-2 rounded shadow">
                {capturedBlack.map((p, i) => (
                    <img
                        key={i}
                        src={pieceMap[p]}
                        alt={p}
                        className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                ))}
            </div>
        </div>
    );
}

export default CapturedPanel;
