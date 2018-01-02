import chai from "chai";
import sinon from "sinon";
import React from "react";
import { shallow } from "enzyme";
import SearchNavButtons from "../src/components/SearchNavButtonsComponent.jsx";

const expect = chai.expect;

function setup(currentSearch, searchCount) {
    const props = {
        currentSearch,
        searchCount,
        setCurrentSearch: sinon.spy(),
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

        expect(wrapper.find("div").hasClass("search-nav")).to.be.true;
        expect(wrapper.find("div").children().length).to.equal(2);
        expect(wrapper.find("button").length).to.equal(2);
        wrapper.find("button").forEach(node => {
            expect(node.hasClass("hidden")).to.be.false;
        });
    });

    it("should not render a left button if currentSearch is below 2", () => {
        const { wrapper } = setup(1, 2);
        expect(wrapper.find("button").first().hasClass("is-hidden")).to.be.true;
    });

    it("should not render a right button if currentSearch is the same as searchCount", () => {
        const { wrapper } = setup(3, 3);
        expect(wrapper.find("button").last().hasClass("is-hidden")).to.be.true;
    });

    it("should dispatch SET_CURRENT_SEARCH with a decrease on clicking left button", () => {
        const { wrapper, props } = setup(2, 3);
        wrapper.find("button").first().simulate("click");
        expect(props.setCurrentSearch.calledWith({name: "event1"})).to.be.true;
    });

    it("should dispatch SET_CURRENT_SEARCH with an increase on clicking right button", () => {
        const { wrapper, props } = setup(2, 3);
        wrapper.find("button").last().simulate("click");
        expect(props.setCurrentSearch.calledWith({name: "event3"})).to.be.true;
    });
});
