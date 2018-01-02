import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import configureStore from "./stores";
import fontawesome from "@fortawesome/fontawesome";
import solids from "@fortawesome/fontawesome-free-solid";

import routes from "./routes.jsx";
import config from "./config.js";

fontawesome.library.add(solids);

export const store = configureStore({
  splashImage: config.getRandomSplashImage()
});

render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes}/>
    </Provider>,
    document.getElementById("app")
);
