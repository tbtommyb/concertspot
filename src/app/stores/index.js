import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import thunk from "redux-thunk";
import { geocodeSearch, addDefaults } from "../middleware";
import reducers from "../reducers";

const composeEnhancers = (
    process.env.NODE_ENV !== "production" && process.env.RENDER_ENV === "browser"
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

export default function(initialState) {
    const store = createStore(
        reducers,
        initialState,
        composeEnhancers(/*autoRehydrate(), */applyMiddleware(addDefaults, geocodeSearch, thunk))
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
