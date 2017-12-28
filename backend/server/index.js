const Hapi = require("hapi");
const Inert = require("inert");
const Vision = require("vision");
const routes = require("./routes");

const port = process.env.PORT || 8000;

const server = new Hapi.Server();

server.connection({
  port
})

server.register([Inert, Vision], err => {
    if(err) throw new Error(err);

    server.route(routes);
});

module.exports = server;
