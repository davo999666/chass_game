import Chess from "./main/Chess.jsx";
import store from "./store/store.js";
import {Provider} from "react-redux";
import MainRouters from "./main/Main.routers.jsx";
import Header from "./main/Header.jsx";

function App() {


    return (
        <Provider store={store}>
            <Header />
            <MainRouters/>
        </Provider>
    )
}

export default App
