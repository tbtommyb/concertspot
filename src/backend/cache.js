import redis from "redis";
import md5 from "md5";
const console = require("./server/logging.js");

const client = redis.createClient();
const hashFields = ["mindate", "maxdate", "radius", "lat", "lng"];
const defaultExpiration = 1800;

client.on("error", (err) => {
    console.log(err);
});


function generateHash(input) {
    let valueToHash = "";
    hashFields.forEach(field => {
        valueToHash += input[field];
    });
    return md5(valueToHash).slice(0, 10);
}

export function generateEventSearchId(searchTerms) {
    return `events:${generateHash(searchTerms)}`;
}

export function generateQueryGenreId(query) {
    return `query_genres:${query}`;
}

export function generateGenreListId() {
    return "genres";
}

export function add(cacheId, data, expiration = defaultExpiration) {
    client.set(cacheId, JSON.stringify(data));
    if(expiration) {
        client.expire(cacheId, expiration);
    }
}

export function get(cacheId, cb) {
    client.get(cacheId, (err, result) => {
        if(err) { return cb(err); }
        return cb(null, JSON.parse(result));
    });
}

export function exists(cacheId) {
    return client.exists(cacheId);
}
