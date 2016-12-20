import expect from "expect";
import React from "react";
import { shallow } from "enzyme";
import { Splash } from "../../src/app/components/SplashComponent.jsx";

function setup() {
    const props = {
        handleSubmit: expect.createSpy()
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
        expect(wrapper.find("div").first().hasClass("splash-component container")).toBe(true);
        expect(wrapper.find("form")).toExist();
    });

    it("should render the correct inputs", () => {
        const { wrapper } = setup();
        expect(wrapper.find("[name='query']")).toExist();
        expect(wrapper.find("[name='location']")).toExist();
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
