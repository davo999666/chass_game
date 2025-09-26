import Chess from "./main/Chess.jsx";
import store from "./store/store.js";
import {Provider} from "react-redux";

function App() {


    return (
        <Provider store={store}>
            <Chess/>
        </Provider>
    )
}

export default App
