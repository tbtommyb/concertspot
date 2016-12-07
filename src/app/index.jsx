
import React from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import configureStore from "./stores";
import routes from "./routes.jsx";

export const store = configureStore();

//require("font-awesome-webpack");

render(
    <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
    </Provider>,
    document.getElementById("app")
);
