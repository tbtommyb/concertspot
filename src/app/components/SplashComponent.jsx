
import React, { PropTypes, Component } from "react";
import { Field, reduxForm } from "redux-form";
import config from "../config.js";

require("../styles/Splash.scss");

export class Splash extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { handleSubmit, splashImage } = this.props;
        // Default for testing where splashImage isn't provided as prop
        if(!splashImage.filename) {
            splashImage = config.splashImages[0];
        }
        return (
            <div className="l-contained">
                <div className="splash">
                    <h1 className="splash-heading">{config.splash.heading}</h1>
                    <p className="splash-message">{config.splash.message}</p>
                    <div className="search l-splash is-collapsed">
                        <form onSubmit={handleSubmit(this.props.submitSearch)} id="splash-form">
                            <Field name="query"
                                component="input"
                                role="input"
                                type="text"
                                aria-labelledby={config.placeholder.artist}
                                placeholder={config.placeholder.artist}/>
                            <Field name="location"
                                component="input"
                                type="text"
                                aria-labelledby={config.placeholder.location}
                                placeholder={config.placeholder.location}/>
                            <button ref="submit" type="submit">{config.placeholder.submit}</button>
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
