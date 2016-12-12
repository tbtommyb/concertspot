//require('font-awesome-webpack');

import server from "./server";

server.start(err => {
    if(err) console.log(err);
    console.log(`Server running on ${server.info.uri}`);
});
