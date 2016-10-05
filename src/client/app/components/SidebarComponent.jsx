
import React from "react";
import { SearchInputContainer } from "../containers/SearchContainer";
import SearchNavButtons from "./SearchNavButtonsComponent.jsx";
import Notification from "./NotificationComponent.jsx";
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
            {isError          ? <Notification message={config.messages.error}/> : null}
            {noResults        ? <Notification message={config.messages.noResults}/> : null}
            <EventList events={events} toggleEvent={props.toggleEvent} />
        </section>
    );
};

export default Sidebar;
