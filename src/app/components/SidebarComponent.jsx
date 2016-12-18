/* TODO - for some reason isFetching is not being set to true
 * when a search is initiated but is instead undefined. */
import React from "react";
import { SearchInputContainer } from "../containers/SearchContainer";
import SearchNavButtons from "./SearchNavButtonsComponent.jsx";
import LoadingBar from "./LoadingBar.jsx";
import EventList from "./EventListComponent.jsx";
import config from "../config.js";

require("../styles/Sidebar.scss");

const Sidebar = (props) => {
    const { events, currentSearchObj } = props;
    const { isError, isFetching } = currentSearchObj;
    const noResults = (isError === false && isFetching === false && !events.length);

    return (
        <section className="sidebar">
            <SearchNavButtons currentSearch={props.currentSearch} searchCount={props.searchCount}
                              searches={props.searches} setCurrentSearch={props.setCurrentSearch} />
            <SearchInputContainer />
            <LoadingBar active={isFetching !== false}/>
            {isError     ? <Notification message={config.messages.error}/> : null}
            {noResults   ? <Notification message={config.messages.noResults}/> : null}
            <EventList events={events} toggleEvent={props.toggleEvent} />
        </section>
    );
};

export default Sidebar;
