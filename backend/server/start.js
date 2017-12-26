require("env2")(__dirname + "/../config.env");

const server = require("./server");
const { cacheGenreList } = require("../tasks");

cacheGenreList((err) => {
    if(err) {
        throw new Error(err);
    }
});

server.start(err => {
    if(err) { throw new Error(err); }
    console.log(`Server running on ${server.info.uri}`);
});
