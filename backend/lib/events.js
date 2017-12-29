const request = require("request-promise-native");
const moment = require("moment");
const each = require("async/each");

const PAGE_LIMIT = 100;
const RESULTS_ORDER = 4;

const buildOffsets = (totalCount) => {
    const offsets = [];
    const limit = totalCount / PAGE_LIMIT;
    for(let i = 1; i <= limit; i++) {
        offsets.push(PAGE_LIMIT * i);
    }
    return offsets;
};

const buildQueryOptions = (query, offset) => {
    const { mindate, maxdate, lat, lng, radius } = query;
    const options = {};
    options.url = process.env.SK_URL;
    options.qs = {
        api_key: process.env.SK_KEY,
        minDate: moment(mindate).format("YYYY-MM-DD"),
        maxDate: moment(maxdate).format("YYYY-MM-DD"),
        "eventcodes[]": ["CLUB", "LIVE"], // TODO check this is working with the qsStringifyOptions
        latitude: lat,
        longitude: lng,
        radius: radius,
        order: RESULTS_ORDER,
        limit: PAGE_LIMIT,
        description: true
    };
    options.stringifyOptions = {
        arrayFormat: "brackets"
    };
    if(offset) {
        options.qs.offset = offset;
    }
    return options;
};

async function fetchPage(query, eventList, offset = 0) {
    const res = await request.get(buildQueryOptions(query, offset));
    const response = JSON.parse(res);

    eventList.push(...response.results);

    return +response.totalcount;
}

async function fetch(query) {
    if(!process.env.SK_URL || !process.env.SK_KEY) {
        throw new Error("Skiddle URL or key not provided");
    }

    let eventList = [];

    let count = await fetchPage(query, eventList);
    if(count <= PAGE_LIMIT) { return eventList; }

    const pageOffsets = buildOffsets(count);

    await Promise.all(pageOffsets.map(offset => fetchPage(query, eventList, offset)));

    return eventList;
}

const filterKeys = event => {
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

const createGenreList = (genres) => {
    return genres.reduce((list, genre) => {
        return list.concat(genre.name.split(" ").map(word => ({
            name: word,
            weighting: genre.weighting
        })));
    }, []);
};

const extractEventGenres = (event) => {
    if(!event.genres) { return []; }
    return [].concat(...event.genres.map(genre => genre.name.toLowerCase().split(" ")));
};

const weightEvent = (event, genreList) => {
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

const recommend = (events, queryGenres) => {
    if(!events || !queryGenres) { return []; }
    const genreList = createGenreList(queryGenres);
    return events
        .map(event => weightEvent(event, genreList))
        .filter(event => event.weighting >= 0.5)
        .sort((a, b) => b.weighting - a.weighting);
};

module.exports = {
  recommend,
  fetch,
  filterKeys
};
