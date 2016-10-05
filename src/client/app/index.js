
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Route, Router, browserHistory } from "react-router";
import configureStore from "./stores";
import App from "./containers/App.jsx";
import MainContainer from "./containers/MainContainer";
import Contact from "./components/ContactComponent.jsx";
import { SplashContainer } from "./containers/SearchContainer";

const store = configureStore();

const routes = (
<Route component={App}>
    <Route path="/" component={SplashContainer}/>
    <Route path="/events" component={MainContainer} />
    <Route path="/contact" component={Contact} />
</Route>);

render(
    <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
    </Provider>,
    document.getElementById("app")
);
