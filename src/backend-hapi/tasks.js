import { fetch, filter } from "./events";
import { getGenreList, getGenresForArtist } from "./db";
import * as cache from "./cache";

// TODO add in all the proper handling in tasks.py
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
        getGenresForArtist(query, (err, genres) => {
            if(err) { return cb(err); }
            cache.add(queryGenreId, genres);
            cb(null, genres);
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
