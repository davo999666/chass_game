import {Route, Routes} from "react-router-dom";
import Chess from "./Chess.jsx";
import {Suspense} from "react";


const MainRouters = () => {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <div className="flex justify-center items-center bg-gray-100">
                <div className="p-4">
                    <Routes >
                        <Route path="/" element={<Chess />} />
                        <Route path="/chass" element={<Chess />} />
                        <Route path="/testchess" element={<Chess />} />
                    </Routes>
                </div>
            </div>
        </Suspense>


    );
};

export default MainRouters;