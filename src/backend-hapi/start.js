require("env2")(__dirname + "/../../config.env");

if(process.env.BROWSER === "true") {
    require("style!css!less!font-awesome-webpack/font-awesome-styles.loader!font-awesome-webpack/font-awesome.config.js");
}

import server from "./server";

server.start(err => {
    if(err) console.log(err);
    console.log(`Server running on ${server.info.uri}`);
});
