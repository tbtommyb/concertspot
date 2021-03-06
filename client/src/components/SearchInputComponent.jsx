import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import NumberPicker from "react-widgets/lib/NumberPicker";
import moment from "moment";
import momentLocalizer from "react-widgets-moment";
import numberLocalizer from "react-widgets-simple-number";
import config from "../config.js";

import "react-widgets/lib/scss/react-widgets.scss";
import "../styles/SearchInput.scss";
import "../styles/Widgets.scss";

moment.locale("en");
momentLocalizer();
numberLocalizer();

// Needed to work with redux-form
const RenderDateTimePicker = props => {
    const { input, label, meta: { error, dirty } } = props;
    const value = input.value;
    const validationClass = "search-validation-message" + (dirty && error ? "" : " is-hidden");
    return (
        <div className="search-details-item whole-row">
            <label className="search-input-label">{label}</label>
            <DateTimePicker
              {...input}
              {...props}
              format={"D MMM"}
              onBlur={null}
              value={!value ? null : new Date(value)}/>
            <span className={validationClass}>{config.messages.validation}</span>
        </div>
    );
};

const RenderRange = props => {
    const { input, label } = props;
    return (
        <div className="search-details-item whole-row">
            <label className="search-input-label">{label}</label>
            <input className="search-input-range" {...input} {...props}/>
            <span className="search-input-value">{input.value} miles</span>
        </div>
    );
};

const validate = values => {
    const errors = {};
    const today = moment();
    if(moment(values.minDate).isBefore(today, "day")) {
        errors.minDate = true;
    }
    if(moment(values.maxDate).isBefore(today, "day")) {
        errors.maxDate = true;
    }
    if(moment(values.maxDate).isBefore(values.minDate, "day")) {
        errors.maxDate = true;
    }
    return errors;
};

export class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails: false
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    }
    render() {
        const { handleSubmit, invalid } = this.props;
        const { showDetails } = this.state;
        const buttonText = showDetails ? "See less" : "See more";
        return (
            <div className={showDetails ? "search l-sidebar" : "search l-sidebar is-collapsed"}>
                <form onSubmit={handleSubmit(this.props.submitSearch)}>
                    <div className="whole-row centered">
                        <Field name="query"
                            component="input"
                            type="text"
                            aria-labelledby="artist"
                            placeholder="artist / genre"/>
                    </div>
                    <div className="whole-row centered">
                        <Field name="location"
                            component="input"
                            type="text"
                            aria-labelledby="location"
                            placeholder="location"/>
                    </div>
                    <div className="whole-row centered">
                        <button className="search-btn left" type="button" onClick={this.handleClick}>{buttonText}</button>
                        <button className="search-btn right" ref="submit" disabled={invalid} type="submit">Submit</button>
                    </div>
                    <div className="search-details-wrapper">
                        <Field
                            name="minDate"
                            aria-labelledby="min_date"
                            component={RenderDateTimePicker}
                            min={new Date()}
                            time={false}
                            label="from"/>
                        <Field
                            name="maxDate"
                            aria-labelledby="max_date"
                            component={RenderDateTimePicker}
                            min={new Date()}
                            time={false}
                            label="to"/>
                        <Field
                            name="radius"
                            aria-labelledby="radius"
                            component={RenderRange}
                            type="range"
                            min={0}
                            max={9}
                            step={1}
                            onBlur={null}
                            label="radius"/>
                    </div>
                </form>
            </div>
        );
    }
}

SearchInput.displayName = "SearchInputComponent";
SearchInput.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitSearch: PropTypes.func.isRequired
};

const SearchInputForm = reduxForm({
    form: "search-input",
    validate,
})(SearchInput);

export default SearchInputForm;
