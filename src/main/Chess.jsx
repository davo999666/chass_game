import Board from "../components/Board.jsx";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import PiecesPool from "../components/PiecesPool.jsx";
import InfoPanel from "../components/InfoPanel.jsx";



export default function Chess() {
    const location = useLocation();
    const [gameState, setGameState] = useState(true)
    useEffect(() => {
    (location.pathname === "/testchess" || location.pathname === "/emptychess") ? setGameState(false) : setGameState(true);
    }, [location]);

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {gameState ? (
                <>
                    <InfoPanel location={"chess"}/>
                    <Board/>
                </>
            ) : (
                <>
                    <InfoPanel location={"testchess"} />
                    <PiecesPool/>
                </>
            )}
        </div>

    );
}
