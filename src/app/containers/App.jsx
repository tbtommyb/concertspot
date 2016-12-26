import React from "react";
import NavBar from "../components/NavBarComponent.jsx";

require("../styles/animations.scss"); // TODO - correct file?
require("../styles/layout/layout.scss");

const App = props => {
    return (
        <div>
            <div id="header">
                <NavBar/>
            </div>
            <div id="content">
                {props.children}
            </div>
        </div>
    );
};

App.displayName = "App";

export default App;
