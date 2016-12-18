import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import thunk from "redux-thunk";
import reducers from "../reducers";

export default function(initialState) {
    const store = createStore(
        reducers,
        initialState,
        compose(autoRehydrate(), applyMiddleware(thunk))
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept("../reducers", () => {
            const nextReducer = require("../reducers");
            store.replaceReducer(nextReducer);
        });
    }
    persistStore(store, {
        blacklist: ["splashImage"]
    });
    return store;
}
