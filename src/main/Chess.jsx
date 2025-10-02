import Board from "../components/Board.jsx";
import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import InfoPanelGame from "../components/InfoPanelGame.jsx";
import PiecesPool from "../components/PiecesPool.jsx";
import InfoPanel from "../components/InfoPanel.jsx";


export default function Chess() {
    const location = useLocation();
    const [gameState, setGameState] = React.useState(true)
    useEffect(() => {
    (location.pathname === "/testchess") ? setGameState(false) : setGameState(true);
    }, [location]);

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {gameState ? (
                <>
                    <InfoPanelGame/>
                    <Board/>
                </>
            ) : (
                <>
                    <InfoPanel/>
                    <PiecesPool/>
                </>
            )}
        </div>

    );
}
