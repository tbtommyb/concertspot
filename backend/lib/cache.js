const redis = require("redis");
const md5 = require("md5");
const console = require("../server/logging.js");

const client = redis.createClient({ host: "redis" });
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

function generateEventSearchId(searchTerms) {
    return `events:${generateHash(searchTerms)}`;
}

function generateQueryGenreId(query) {
    return `query_genres:${query}`;
}

function generateGenreListId() {
    return "genres";
}

function add(cacheId, data, expiration = defaultExpiration) {
    client.set(cacheId, JSON.stringify(data));
    if(expiration) {
        client.expire(cacheId, expiration);
    }
}

function get(cacheId, cb) {
    client.get(cacheId, (err, result) => {
        if(err) { return cb(err); }
        return cb(null, JSON.parse(result));
    });
}

function exists(cacheId) {
    return client.exists(cacheId);
}

module.exports = {
  generateEventSearchId,
  generateQueryGenreId,
  generateGenreListId,
  add,
  get,
  exists
};
