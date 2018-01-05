const { fetch, filterKeys } = require("./events");
const { getGenreList, getGenresForArtist } = require("../db/queries");
const cache = require("./cache");

const TERMS = ["events", "event", "clubs", "club",  "clubnights",
               "clubnight", "music", "parties", "party", "gigs", "gig",
               "nights", "night"];

const sanitise = (query) => {
    return query.toLowerCase().replace(new RegExp(TERMS.join("|")), "").trim();
};

async function checkIfGenre(query) {
    const genres = await cache.get(cache.generateGenreListId());
    const sanitisedQuery = sanitise(query);

    const results = [];
    if(genres && genres.includes(sanitisedQuery)) {
        // Create a genre object to match the query term
        results.push({ name: sanitisedQuery, weighting: 1.0 });
    }

    return results;
}

async function fetchEvents(query) {
    const eventSearchId = cache.generateEventSearchId(query);
    const events = await cache.get(eventSearchId);
    if(events) { return events; }

    // Not cached so fetch and cache
    const resp = await fetch(query);
    cache.add(eventSearchId, resp.map(filterKeys));
    return await cache.get(eventSearchId);
}

async function getGenresForQuery(query) {
    const queryGenreId = cache.generateQueryGenreId(query);
    const genres = await cache.get(queryGenreId);
    if(genres) { return genres; }

    const artistGenres = await getGenresForArtist(query);
    if(artistGenres.length) {
        cache.add(queryGenreId, artistGenres);
        return artistGenres;
    }

    const queryGenres = await checkIfGenre(query);
    if(queryGenres.length) {
        cache.add(queryGenreId, queryGenres);
        return queryGenres;
    }

    return [];
}

async function cacheGenreList() {
    const genres = await getGenreList();
    cache.add(cache.generateGenreListId(), genres);
}

module.exports = {
  fetchEvents,
  getGenresForQuery,
  cacheGenreList,
};
