import Hapi from "hapi";
import Inert from "inert";
import Vision from "vision";
import injectThen from "inject-then";
import routes from "./routes";

const server = new Hapi.Server();

require("babel-register")({
    presets: ["es2015", "react"]
});

const port = process.env.PORT || 8000;
server.connection({
    port
});

server.register([Inert, Vision, injectThen], err => {
    if(err) throw new Error(err);

    server.route(routes);
});

export default server;

module.exports = server;