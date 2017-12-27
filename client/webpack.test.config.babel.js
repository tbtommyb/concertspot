import nodeExternals from "webpack-node-externals";

const config = require("./webpack.server.config.js");
config.externals = [nodeExternals()];

export default config;
