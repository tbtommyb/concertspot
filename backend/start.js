require("env2")(__dirname + "/config.env");

const initialiseServer = require("./server");
const { cacheGenreList } = require("./lib/tasks.js");

cacheGenreList((err) => {
    if(err) {
        throw new Error(err);
    }
});

async function start() {
    try {
        const server = await initialiseServer();
        await server.start();
        console.log(`Server running on ${server.info.uri}`);
    }
    catch (err) {
        throw err;
    }
}

start();
