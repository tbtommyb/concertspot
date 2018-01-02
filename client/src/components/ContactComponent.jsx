import React from "react";
import PropTypes from "prop-types";

const Contact = props => {
    return (
        <div className="l-contained">
            <div className="text-box">
                <h1>We'd love to hear from you</h1>
                <p>If you'd like to get in touch with us about anything at all, please email: hello@concertspot.co.uk</p>
            </div>
        </div>
    );
};

Contact.displayName = "Contact";
Contact.propTypes = {};

export default Contact;
