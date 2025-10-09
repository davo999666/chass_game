import { HashRouter as Router, Route, Routes} from "react-router-dom";
import Chess from "./Chess.jsx";
import {Suspense} from "react";
import EmptySquare from "../components/EmptySquare.jsx";


const MainRouters = () => {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <div className="flex justify-center items-center bg-sky-50">
                <div className="p-1">
                    <Routes >
                        <Route path="/" element={<Chess />} />
                        <Route path="/chess" element={<Chess />} />
                        <Route path="/testchess" element={<Chess />} />
                        <Route path="/emptychess" element={<EmptySquare/>} />
                    </Routes>
                </div>
            </div>
        </Suspense>
    );
};

export default MainRouters;