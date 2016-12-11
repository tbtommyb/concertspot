import { fetch, filter } from "./events";
import { getGenres, getGenresForArtist } from "./db";
import cache from "./cache";

// TODO add in all the proper handling in tasks.py
export const fetchEvents = (query, cb) => {
    fetch(query, (err, events) => {
        const filtered = events.map(filter);
        cache.set("test1", filtered);
        console.log(cache.get("test1"));
        cb(null, filtered);
    });
};

export const getGenresForQuery = (query, cb) => {
    getGenresForArtist(query, (err, genres) => {
        if(err) return cb(err);
        cache.set(`genres:${query}`, genres);
        cb(null, genres);
    });
};