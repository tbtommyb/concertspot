import expect from "expect";
import React from "react";
import { shallow } from "enzyme";
import { SearchInput } from "../../src/app/components/SearchInputComponent.jsx";

function setup() {
    const props = {
        fields: {
            query: "Surgeon",
            location: "Leeds",
            radius: "3",
            dates: "weekend"
        },
        handleSubmit: expect.createSpy()
    };

    const wrapper = shallow(<SearchInput {...props} />);

    return {
        props,
        wrapper
    };
}

describe("SearchInput component", () => {
    it("should render a form", () => {
        const { wrapper } = setup();
        expect(wrapper.find("div").first().hasClass("search-input")).toBe(true);
        expect(wrapper.find("form")).toExist();
    });

    it("should render the correct inputs", () => {
        const { wrapper } = setup();
        expect(wrapper.find("[name='query']")).toExist();
        expect(wrapper.find("[name='location']")).toExist();
        expect(wrapper.find("[name='radius']")).toExist();
        expect(wrapper.find("[name='minDate']")).toExist();
        expect(wrapper.find("[name='maxDate']")).toExist();
    });

    it("should render a submit button", () => {
        const { wrapper } = setup();
        expect(wrapper.find("button")).toExist();
    });

    it("should correctly submit a search", () => {
        const { wrapper, props } = setup();
        wrapper.find("button").simulate("click");
        expect(props.handleSubmit).toHaveBeenCalled();
    });
});
