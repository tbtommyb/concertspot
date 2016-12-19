import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import configureStore from "./stores";
import routes from "./routes.jsx";

if(process.env.RENDER_ENV === "browser") {
    require("style!css!less!font-awesome-webpack/font-awesome-styles.loader!font-awesome-webpack/font-awesome.config.js");
}

const preloadedState = window.__PRELOADED_STATE__;

export const store = configureStore(preloadedState);

render(
    <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
    </Provider>,
    document.getElementById("app")
);
