import Board from "../components/Board.jsx";
import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import InfoPanel from "../components/InfoPanel.jsx";
import PiecesPool from "../components/PiecesPool.jsx";


export default function Chess() {
    // const turn = useSelector((s) => s.chess.turn);
    // const dispatch = useDispatch();
    const location = useLocation();
    const [gameState, setGameState] = React.useState(true)
    useEffect(() => {
        if(location.pathname === "/testchess") {
            setGameState(false)
        }else {
            setGameState(true)
        }
    }, [location]);

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {gameState ? (
                <>
                    <InfoPanel/>
                    <Board/>
                </>
            ) : (
                <PiecesPool/>
            )}
        </div>

    );
}
