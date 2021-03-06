import React from "react";
import { SearchInputContainer } from "../containers/SearchContainer";
import SearchNavButtons from "./SearchNavButtonsComponent.jsx";
import LoadingBar from "./LoadingBar.jsx";
import Notification from "./NotificationComponent.jsx";
import EventList from "./EventListComponent.jsx";
import config from "../config.js";

import "../styles/Results.scss";

const Sidebar = (props) => {
    const { events, currentSearchObj } = props;
    const { isError, isFetching } = currentSearchObj;
    const noResults = (isError === false && isFetching === false && !events.length);

    return (
        <section id="results" className="l-sidebar">
            <SearchNavButtons currentSearch={props.currentSearch} searchCount={props.searchCount}
                              searches={props.searches} setCurrentSearch={props.setCurrentSearch} />
            <SearchInputContainer />
            <LoadingBar active={isFetching}/>
            {isError     ? <Notification message={config.messages.error}/> : null}
            {noResults   ? <Notification message={config.messages.noResults}/> : null}
            <EventList events={events} toggleEvent={props.toggleEvent} />
        </section>
    );
};

export default Sidebar;
