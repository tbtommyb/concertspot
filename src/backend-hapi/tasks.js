import { fetch, filter } from "./events";
import { getGenreList, getGenresForArtist } from "./db/queries";
import * as cache from "./cache";

const TERMS = ["events", "event", "clubs", "club",  "clubnights",
               "clubnight", "music", "parties", "party", "gigs", "gig",
               "nights", "night"];

export const sanitise = (query) => {
    return query.toLowerCase().replace(new RegExp(TERMS.join("|")), "").trim();
};

export const checkIfGenre = (query, cb) => {
    cache.get(cache.generateGenreListId(), (err, genres) => {
        if(err) { return cb(err); }
        const sanitisedQuery = sanitise(query);
        const results = [];
        if(genres.includes(sanitisedQuery)) {
            results.push({
                name: sanitisedQuery,
                weighting: 1.0
            });
        }
        return cb(null, results);
    });
};

export const fetchEvents = (query, cb) => {
    const eventSearchId = cache.generateEventSearchId(query);
    cache.get(eventSearchId, (err, events) => {
        if(err) { return cb(err); }
        if(events) { return cb(null, events); }
        fetch(query, (err, fetchedEvents) => {
            if(err) { return cb(err); }
            const filtered = fetchedEvents.map(filter);
            cache.add(eventSearchId, filtered);
            cb(null, filtered);
        });
    });
};

export const getGenresForQuery = (query, cb) => {
    const queryGenreId = cache.generateQueryGenreId(query);
    cache.get(queryGenreId, (err, genres) => {
        if(err) { return cb(err); }
        if(genres) { return cb(null, genres); }
        // Check if query matches any artists
        getGenresForArtist(query, (err, genres) => {
            if(err) { return cb(err); }
            if(genres.length) {
                // Matched - query is an artist
                cache.add(queryGenreId, genres);
                return cb(null, genres);
            }
            // Check if query matches any genres
            checkIfGenre(query, (err, genres) => {
                if(err) { return cb(err); }
                cache.add(queryGenreId, genres);
                return cb(null, genres);
            });
        });
    });
};

export const cacheGenreList = (cb) => {
    getGenreList((err, genres) => {
        if(err) { return cb(err); }
        cache.add(cache.generateGenreListId(), genres);
        cb(null);
    });
};
