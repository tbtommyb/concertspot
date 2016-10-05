
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { enableBatching } from "redux-batched-actions";
import reducers from "../reducers";

export default function(initialState) {
    const store = createStore(
        reducers,
        initialState,
        applyMiddleware(thunk)
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept("../reducers", () => {
            const nextReducer = require("../reducers");
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
