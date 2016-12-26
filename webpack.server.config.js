var path = require("path");
var webpack = require("webpack");
var baseConfig = require("./webpack.base.config.js");

require("env2")(__dirname + "/config.env");

const BUILD_DIR = path.resolve(__dirname, "src/build/static");
const SERVER_DIR = path.resolve(__dirname, "src/backend");

process.env.RENDER_ENV = "server";

var serverLoaders = [
    {
        test: /\.jsx?/,
        include: __dirname + "/src",
        exclude: /node_modules/,
        loader: "babel",
        query: {
            cacheDirectory: true
        }
    },
    {
        test: /\.json$/,
        loader: "json-loader"
    }
];

var serverPlugins = [
    new webpack.EnvironmentPlugin([
        "NODE_ENV",
        "RENDER_ENV",
        "DB_URL",
        "DB_MAX_CONNECTIONS",
        "SK_KEY",
        "SK_URL"]
    )
];

var config = {
    target: "node",
    node: {
        __dirname: false
    },
    entry: [
        SERVER_DIR + "/server/start.js"
    ],
    output: {
        path: BUILD_DIR,
        publicPath: "/static/",
        filename: "../server.bundle.js",
        libraryTarget: "commonjs2"
    },
    externals: /^[a-z\-0-9]+$/
};

var serverConfig = Object.assign({}, baseConfig, config);
serverConfig.module.loaders.push(...serverLoaders);
serverConfig.plugins.push(...serverPlugins);

module.exports = serverConfig;
