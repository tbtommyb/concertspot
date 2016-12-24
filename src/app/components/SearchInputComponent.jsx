
import React, { PropTypes, Component } from "react";
import { Field, reduxForm } from "redux-form";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import NumberPicker from "react-widgets/lib/NumberPicker";
import moment from "moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import numberLocalizer from "react-widgets/lib/localizers/simple-number";
import config from "../config.js";

require("../styles/SearchInput.scss");

// Needed to work with redux-form
const renderDateTimePicker = props => {
    const { input, label, meta: { error, dirty } } = props;
    const validationClass = "search-validation-message" + (dirty && error ? "" : " is-hidden");
    return (
        <div>
            <label className="search-input-label">{label}</label>
            <DateTimePicker {...input} {...props} format={"D MMM"} />
            <span className={validationClass}>{config.messages.validation}</span>
        </div>
    );
};

const renderNumberPicker = props => {
    const { input, label } = props;
    return (
        <div>
            <label className="search-input-label">{label}</label>
            <NumberPicker {...input} {...props} />
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

momentLocalizer(moment);
numberLocalizer();

export class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails: false
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log("click!")
        this.setState({
            showDetails: !this.state.showDetails
        });
    }
    render() {
        const { handleSubmit, invalid } = this.props;
        const { showDetails } = this.state;
        return (
            <div className={showDetails ? "search l-sidebar" : "search l-sidebar is-collapsed"}>
                <form onSubmit={handleSubmit(this.props.submitSearch)}>
                    <div className="whole-row centered">
                        <Field name="query"
                            component="input"
                            type="text"
                            aria-labelledby={config.placeholder.artist}
                            placeholder={config.placeholder.artist}/>
                    </div>
                    <div className="whole-row centered">
                        <Field name="location"
                            component="input"
                            type="text"
                            aria-labelledby={config.placeholder.location}
                            placeholder={config.placeholder.location}/>
                    </div>
                    <div className="whole-row centered">
                        <button className="search-btn left" type="button" onClick={this.handleClick}>See more</button>
                        <button className="search-btn right" ref="submit" disabled={invalid} type="submit">Submit</button>
                        <div className="search-details-wrapper">
                            <Field
                                name="minDate"
                                aria-labelledby="min_date"
                                component={renderDateTimePicker}
                                min={new Date()}
                                time={false}
                                onBlur={null}
                                label="from"/>
                            <Field
                                name="maxDate"
                                aria-labelledby="max_date"
                                component={renderDateTimePicker}
                                min={new Date()}
                                time={false}
                                onBlur={null}
                                label="to"/>
                            <Field
                                name="radius"
                                aria-labelledby="radius"
                                component={renderNumberPicker}
                                min={1}
                                max={9}
                                onBlur={null}
                                label="radius"/>
                        </div>
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
    validate
})(SearchInput);

export default SearchInputForm;
