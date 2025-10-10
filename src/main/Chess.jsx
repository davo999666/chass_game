import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Board from "../components/Board.jsx";
import PiecesPool from "../components/PiecesPool.jsx";
import InfoPanel from "../components/InfoPanel.jsx";

export default function Chess() {
    const location = useLocation();
    const [gameState, setGameState] = useState(true);

    useEffect(() => {
        setGameState(location.pathname !== "/testchess");
    }, [location]);

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {gameState ? (
                <>
                    <InfoPanel location="chess" />
                    <Board />  {/* ✅ PromotionPanel will appear INSIDE Board */}
                </>
            ) : (
                <>
                    <InfoPanel location="testchess" />
                    <PiecesPool />
                </>
            )}
        </div>
    );
}
