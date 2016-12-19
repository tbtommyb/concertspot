import nodeExternals from 'webpack-node-externals';

let config = require("./webpack.server.config.js");
config.externals = [nodeExternals()];
export default config;
