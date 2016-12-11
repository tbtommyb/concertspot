const request = require("request");
import moment from "moment";

require("env2")(__dirname + "/../../config.env");

export const fetch = (query, cb) => {
    if(!process.env.SK_URL || !process.env.SK_KEY) {
        throw new Error("Skiddle URL or key not provided");
    }
    const { mindate, maxdate, lat, lng, radius } = query;
    const events = [];
    const params = {
        api_key: process.env.SK_KEY,
        minDate: moment(mindate).format("YYYY-MM-DD"),
        maxDate: moment(maxdate).format("YYYY-MM-DD"),
        "eventcodes[]": ["CLUB", "LIVE"], // TODO check this is working with the qsStringifyOptions
        latitude: lat,
        longitude: lng,
        radius: radius,
        order: 4,
        limit: 100
    };
    const stringifyOptions = {
        arrayFormat: "brackets"
    };
    request.get({url: process.env.SK_URL, qs: params, qsStringifyOptions: stringifyOptions}, (err, response, body) => {
        if(err) return cb(err);
        const resp = JSON.parse(body);
        events[0] = resp.results;
        const callsToMake = Math.floor(parseInt(resp.totalcount, 10) / 100); // check this gives integer
        if(!callsToMake) { return cb(null, [].concat.apply([],events)); }

        let completionCount = 0;
        for(let i = 1; i <= callsToMake; i++) {
            request.get({url: process.env.SK_URL, qs: Object.assign({}, params, {offset: 100 * i})},
                (err, response, body) => {
                    let resp = JSON.parse(body);
                    events[i] = resp.results;
                    completionCount++;
                    if(completionCount === callsToMake) {
                        cb(null, [].concat.apply([],events));
                    }
                });
        }
        
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
export const createGenreList = genres => {
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

export const extractEventGenres = event => {
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
/*
fetch({
    mindate: "2016-12-07",
    maxdate: "2016-12-10",
    lat: 51.508386,
    lng: -0.125382,
    radius: 0.8
}, (err, result) => {
    if(err) { console.log("Err", err); }
});*/

// TODO - filter events
