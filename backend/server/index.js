const Hapi = require("hapi");
const Inert = require("inert");
const Vision = require("vision");
const routes = require("./routes");

const port = process.env.PORT || 8000;

async function initialiseServer() {
    const server = new Hapi.Server({ port });
    await server.register([Inert, Vision]);
    server.route(routes);
    return server;
};

module.exports = initialiseServer;
