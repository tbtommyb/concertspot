import expect from "expect";
import React from "react";
import { shallow } from "enzyme";
import SearchNavButtons from "../../src/app/components/SearchNavButtonsComponent.jsx";

function setup(currentSearch, searchCount) {
    const props = {
        currentSearch,
        searchCount,
        setCurrentSearch: expect.createSpy(),
        searches: {
            1: {name:"event1"},
            2: {name:"event2"},
            3: {name:"event3"}
        }
    };

    const wrapper = shallow(<SearchNavButtons {...props} />);

    return {
        props,
        wrapper
    };
}

describe("SearchNavButtonsComponent", () => {
    it("should render correctly", () => {
        const { wrapper } = setup(2, 3);

        expect(wrapper.find("div").hasClass("search-nav")).toBe(true);
        expect(wrapper.find("div").children().length).toBe(2);
        expect(wrapper.find("button").length).toBe(2);
        wrapper.find("button").forEach(node => {
            expect(node.hasClass("hidden")).toBe(false);
        });
    });

    it("should not render a left button if currentSearch is below 2", () => {
        const { wrapper } = setup(1, 2);
        expect(wrapper.find("button").first().hasClass("hidden")).toBe(true);
    });

    it("should not render a right button if currentSearch is the same as searchCount", () => {
        const { wrapper } = setup(3, 3);
        expect(wrapper.find("button").last().hasClass("hidden")).toBe(true);
    });

    it("should dispatch SET_CURRENT_SEARCH with a decrease on clicking left button", () => {
        const { wrapper, props } = setup(2, 3);
        wrapper.find("button").first().simulate("click");
        expect(props.setCurrentSearch).toHaveBeenCalledWith({name: "event1"});
    });

    it("should dispatch SET_CURRENT_SEARCH with an increase on clicking right button", () => {
        const { wrapper, props } = setup(2, 3);
        wrapper.find("button").last().simulate("click");
        expect(props.setCurrentSearch).toHaveBeenCalledWith({name: "event3"});
    });
});
