import React, {useEffect} from "react";
import Square from "./Square.jsx";


const Board = () => {
    useEffect(() => {
        // Prevent selecting text while dragging/clicking rapidly
        document.body.style.userSelect = "none";
        return () => {
            document.body.style.userSelect = "auto";
        };
    }, []);

    return (

        <div className="grid grid-cols-8 shadow-2xl rounded-md overflow-hidden">
            {Array.from({length: 8}).map((_, r) => (
                <React.Fragment key={r}>
                    {Array.from({length: 8}).map((_, c) => (
                        <Square key={`${r}-${c}`} r={r} c={c}/>
                    ))}
                </React.Fragment>
            ))}
        </div>

    );
};

export default Board;