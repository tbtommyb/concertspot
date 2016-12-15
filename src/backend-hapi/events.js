const request = require("request");
import moment from "moment";
import each from "async/each";

const RESULTS_LIMIT = 100;
const RESULTS_ORDER = 4;

const buildOffsets = (totalCount) => {
    const offsets = [];
    const limit = Math.floor(parseInt(totalCount, 10) / RESULTS_LIMIT);
    for(let i = 1; i <= limit; i++) {
        offsets.push(RESULTS_LIMIT * i);
    }
    return offsets;
};

const buildQueryOptions = (query, offset) => {
    const { mindate, maxdate, lat, lng, radius } = query;
    const options = {};
    options.url = process.env.SK_URL;
    options.qs = {
        api_key: process.env.SK_KEY,
        minDate: mindate,
        maxDate: maxdate,
        "eventcodes[]": ["CLUB", "LIVE"], // TODO check this is working with the qsStringifyOptions
        latitude: lat,
        longitude: lng,
        radius: radius,
        order: RESULTS_ORDER,
        limit: RESULTS_LIMIT
    };
    options.stringifyOptions = {
        arrayFormat: "brackets"
    };
    return options;
};

export const fetch = (query, cb) => {
    if(!process.env.SK_URL || !process.env.SK_KEY) {
        throw new Error("Skiddle URL or key not provided");
    }
    let events = [];
    request.get(buildQueryOptions(query), (err, res, body) => {
        if(err) { return cb(err); }
        if(res.statusCode !== 200) { return cb(body); }

        const response = JSON.parse(body);
        events = events.concat(response.results);

        const callsToMake = buildOffsets(response.totalcount); // check this gives integer
        if(!callsToMake.length) { return cb(null, events); }
        // We don't have all the results yet so need to send off more queries

        each(callsToMake, (offset, callback) => {
            // TODO - debug this function
            request.get(buildQueryOptions(query, offset), (err, res, body) => {
                if(err) { return callback(err); }
                events = events.concat(JSON.parse(body).results);
                callback();
            });
        }, (err) => {
            if(err) { return cb(err); }
            cb(null, events);
        });
    });
};

export const filter = event => {
    const keys = {
        "artists": "artists",
        "date": "date",
        "description": "description",
        "genres": "genres",
        "id": "id",
        "imageurl": "imageurl",
        "largeimageurl": "largeimageurl",
        "link": "link",
        "price": "entryprice",
        "tickets": "tickets",
        "ticketsAvail": "ticketsAvail",
        "title": "eventname",
        "venue": "venue"
    };
    // TODO - find neater way of doing this
    const filteredEvent = {};
    Object.keys(keys).forEach(key => {
        filteredEvent[key] = event[keys[key]];
    });
    filteredEvent.times = {
        opening: event.openingtimes.doorsopen,
        closing: event.openingtimes.doorsclose
    };
    filteredEvent.active = false;
    return filteredEvent;
};

// TODO simplify - could use concat and map
export const createGenreList = (genres) => {
    const genresSplitNames = [];
    genres.forEach(genre => {
        genre.name.split(" ").forEach(word => {
            genresSplitNames.push({
                name: word,
                weighting: genre.weighting
            });
        });
    });
    return genresSplitNames;
};

export const extractEventGenres = (event) => {
    return [].concat(...event.genres.map(genre => genre.name.toLowerCase().split(" ")));
};

export const weightEvent = (event, genreList) => {
    const eventGenres = extractEventGenres(event);
    const weightedEvent = Object.assign({}, event);
    weightedEvent.weighting = genreList.reduce((prev, cur) => {
        if(eventGenres.indexOf(cur.name.toLowerCase()) > -1) {
            return prev + cur.weighting;
        }
        return prev;
    }, 0);
    return weightedEvent;
};

export const recommend = (events, queryGenres) => {
    const genreList = createGenreList(queryGenres);
    return events
        .map(event => weightEvent(event, genreList))
        .filter(event => event.weighting >= 0.5)
        .sort((a, b) => b.weighting - a.weighting);
};

