
import React, { PropTypes, Component } from "react";
import { Field, reduxForm } from "redux-form";
import config from "../config.js";
import random from "../scripts/random.js";

require("../styles/Splash.scss");

export class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: config.splashImages[random(config.splashImages.length)]
        };
    }
    render() {
        const { handleSubmit } = this.props;
        const { image } = this.state;
        return (
            <div className="splash-component container">
                <div className="cover-message">
                    <div>
                        <h1>{config.splash.heading}</h1>
                        <p>{config.splash.message}</p>
                    </div>
                    <div>
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
                <div className="cover-img">
                    <img src={require("../images/"+image.filename)} className="img-bg" alt=""/>
                    <a className="credit" href={image.url}>{image.author}</a>
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
