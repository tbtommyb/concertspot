const Hapi = require("hapi");
const Inert = require("inert");
const Vision = require("vision");
const injectThen = require("inject-then");
const routes = require("./routes.js");
const server = new Hapi.Server();

require("babel-register")({
    presets: ["es2015", "react"]
});

const port = process.env.PORT || 8000;
server.connection({
    port
});

server.register([Inert, Vision, injectThen], err => {
    if(err) console.log(err);

    server.route(routes);
});

export default server;