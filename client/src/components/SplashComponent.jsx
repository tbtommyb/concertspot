import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import config from "../config.js";

import "../styles/Splash.scss";

export class Splash extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { handleSubmit, splashImage } = this.props;
        // Default for testing where splashImage isn't provided as prop
        if(!splashImage) {
            splashImage = config.splashImages[0];
        }
        return (
            <div className="l-contained">
                <div className="splash">
                    <h1 className="splash-heading">Find the perfect gig</h1>
                    <p className="splash-message">Discover great new events. Just enter the music you're looking for and your location. We'll do the rest.</p>
                    <div className="search l-splash is-collapsed">
                        <form onSubmit={handleSubmit(this.props.submitSearch)} id="splash-form">
                            <Field name="query"
                                component="input"
                                role="input"
                                type="text"
                                aria-labelledby="query"
                                placeholder="artist / genre"/>
                            <Field name="location"
                                component="input"
                                type="text"
                                aria-labelledby="location"
                                placeholder="town / postcode"/>
                            <button ref="submit" type="submit">Find events</button>
                        </form>
                    </div>
                </div>
                <div className="splash-img">
                    <img src={require("../images/"+splashImage.filename)} className="img-bg" alt=""/>
                    <a className="credit" href={splashImage.url}>{splashImage.author}</a>
                </div>
            </div>
        );
    }
}

Splash.displayName = "Splash";
Splash.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitSearch: PropTypes.func.isRequired
};

const SplashForm = reduxForm({
    form: "splash"
})(Splash);

export default SplashForm;
