
import React from "react";
import NavBar from "../components/NavBarComponent.jsx";

require("../styles/animations.scss");

const App = props => {
    return (
        <div>
            <NavBar/>
            {props.children}
        </div>
    );
};

App.displayName = "App";

export default App;
