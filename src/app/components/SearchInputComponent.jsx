
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
    const validationClass = "search-validation-message" + (dirty && error ? "" : " hidden");
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
    }
    render() {
        const { handleSubmit, invalid } = this.props;
        return (
            <div className="search l-sidebar">
                <form onSubmit={handleSubmit(this.props.submitSearch)}>
                    <div className="search-inputs-wrapper">
                        <Field name="query"
                            component="input"
                            type="text"
                            aria-labelledby={config.placeholder.artist}
                            placeholder={config.placeholder.artist}/>
                        <Field name="location"
                            component="input"
                            type="text"
                            aria-labelledby={config.placeholder.location}
                            placeholder={config.placeholder.location}/>
                        <button ref="submit" disabled={invalid} type="submit">Submit</button>
                    </div>
                    <div className="search-inputs-wrapper">
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
