import chai from "chai";
import sinon from "sinon";
import React from "react";
import { shallow } from "enzyme";
import { Splash } from "../src/components/SplashComponent.jsx";

const expect = chai.expect;

function setup() {
    const props = {
        handleSubmit: sinon.spy()
    };

    const wrapper = shallow(<Splash {...props} />);

    return {
        props,
        wrapper
    };
}

describe("Splash", () => {
    it("should render a <form> element", () => {
        const { wrapper } = setup();
        expect(wrapper.find("form")).to.exist;
    });

    it("should render the correct inputs", () => {
        const { wrapper } = setup();
        expect(wrapper.find("[name='query']")).to.exist;
        expect(wrapper.find("[name='location']")).to.exist;
    });

    it("should render a submit button", () => {
        const { wrapper } = setup();
        expect(wrapper.find("button")).to.exist;
    });

    it("should correctly submit a search", () => {
        const { wrapper, props } = setup();
        wrapper.find("button").simulate("click");
        expect(props.handleSubmit.called).to.be.true;
    });
});
