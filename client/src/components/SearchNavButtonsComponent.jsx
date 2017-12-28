
import React, { PropTypes } from "react";

require("../styles/NavButton.scss");

const SearchNavButtons = props => {
    const { currentSearch, searchCount, searches, setCurrentSearch } = props;
    const showPrevious = currentSearch > 1;
    const showNext = currentSearch < searchCount;

    const _incrementSearch = () => {
        setCurrentSearch(searches[currentSearch + 1]);
    };
    const _decrementSearch = () => {
        setCurrentSearch(searches[currentSearch - 1]);
    };

    return (
        <div className="search-nav">
            <button className={showPrevious ? null : "is-hidden"}
                    onClick={_decrementSearch}
                    type="button">
                &lt;
            </button>
            <button className={showNext ? null : "is-hidden"}
                    onClick={_incrementSearch}
                    type="button">
                &gt;
            </button>
        </div>
    );
};

SearchNavButtons.displayName = "SearchNavButtons";
SearchNavButtons.propTypes = {
    currentSearch: PropTypes.number,
    searchCount: PropTypes.number.isRequired,
    searches: PropTypes.object.isRequired,
    setCurrentSearch: PropTypes.func.isRequired
};

export default SearchNavButtons;
