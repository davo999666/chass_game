import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="flex items-center gap-6 p-4 border-b bg-gray-200">
            <nav className="flex gap-2">
                <NavLink
                    to="/chass"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-xl text-sm md:text-base transition hover:opacity-90 ${
                            isActive ? "bg-black text-white shadow-md" : "bg-blue-200 text-gray-800"
                        }`
                    }
                    end
                >
                    Game Board
                </NavLink>
                <NavLink
                    to="/testchess"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-xl text-sm md:text-base transition hover:opacity-90 ${
                            isActive ? "bg-black text-white shadow-md" : "bg-blue-200 text-gray-800"
                        }`
                    }
                >
                    Empty Board
                </NavLink>
                <NavLink
                    to="/emptychess"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-xl text-sm md:text-base transition hover:opacity-90 ${
                            isActive ? "bg-black text-white shadow-md" : "bg-blue-200 text-gray-800"
                        }`
                    }
                >
                    Empty Board without legal
                </NavLink>
            </nav>
        </header>
    );
}
