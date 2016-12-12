import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import configureStore from "./stores";
import routes from "./routes.jsx";

if(process.env.BROWSER === "true") {
    require("style!css!less!font-awesome-webpack/font-awesome-styles.loader!font-awesome-webpack/font-awesome.config.js");
}

export const store = configureStore();

render(
    <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
    </Provider>,
    document.getElementById("app")
);
