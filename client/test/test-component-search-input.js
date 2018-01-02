import chai from "chai";
import sinon from "sinon";
import React from "react";
import { shallow } from "enzyme";
import { SearchInput } from "../src/components/SearchInputComponent.jsx";

const expect = chai.expect;

function setup() {
    const props = {
        fields: {
            query: "Surgeon",
            location: "Leeds",
            radius: "3",
            dates: "weekend"
        },
        handleSubmit: sinon.spy()
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
        expect(wrapper.find("div").first().hasClass("search")).to.be.true;
        expect(wrapper.find("form")).to.exist;
    });

    it("should render the correct inputs", () => {
        const { wrapper } = setup();
        expect(wrapper.find("[name='query']")).to.exist;
        expect(wrapper.find("[name='location']")).to.exist;
        expect(wrapper.find("[name='radius']")).to.exist;
        expect(wrapper.find("[name='minDate']")).to.exist;
        expect(wrapper.find("[name='maxDate']")).to.exist;
    });

    it("should render a submit button", () => {
        const { wrapper } = setup();
        expect(wrapper.find("button")).to.exist;
    });

    it("should correctly submit a search", () => {
        const { wrapper, props } = setup();
        wrapper.find(".search-btn.right").simulate("click");
        expect(props.handleSubmit.called).to.be.true;
    });
});
