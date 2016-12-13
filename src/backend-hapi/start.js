require("env2")(__dirname + "/../../config.env");

import server from "./server";
import { cacheGenreList } from "./tasks";

cacheGenreList((err) => {
    if(err) {
        throw new Error(err);
    }
});

server.start(err => {
    if(err) { throw new Error(err); }
    console.log(`Server running on ${server.info.uri}`);
});
