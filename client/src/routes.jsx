import React from "react";
import { Route, IndexRoute } from "react-router";
import App from "./containers/App.jsx";
import MainContainer from "./containers/MainContainer";
import Contact from "./components/ContactComponent.jsx";
import { SplashContainer } from "./containers/SearchContainer";

const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={SplashContainer}/>
        <Route path="events" component={MainContainer}/>
        <Route path="contact" component={Contact}/>
    </Route>
);

export default routes;
