require("env2")(__dirname + "/../../config.env");

import server from "./server";

server.start(err => {
    if(err) console.log(err);
    console.log(`Server running on ${server.info.uri}`);
});
