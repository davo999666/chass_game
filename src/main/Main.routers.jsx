import {Route, Routes} from "react-router-dom";
import Chess from "./Chess.jsx";
import {Suspense} from "react";
import TestChess from "./TestChess.jsx";

const MainRouters = () => {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <div className="flex justify-center items-center bg-gray-100">
                <div className="p-4">
                    <Routes >
                        <Route path="/chass" element={<Chess />} />
                        <Route path="/testchess" element={<TestChess />} />
                    </Routes>
                </div>
            </div>
        </Suspense>


    );
};

export default MainRouters;