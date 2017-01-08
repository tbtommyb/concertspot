var path = require("path");
var webpack = require("webpack");
var htmlWebpackPlugin = require("html-webpack-plugin");

require("env2")(__dirname + "/config.env");

const BUILD_DIR = path.resolve(__dirname, "src/build/static");
const APP_DIR = path.resolve(__dirname, "src/app");

process.env.RENDER_ENV = "browser";

var baseConfig = require("./webpack.base.config.js");

function getEntrySources(sources) {
    if(process.env.NODE_ENV === "serve") {
        sources.push("webpack-dev-server/client?http://localhost:8080");
        sources.push("webpack/hot/only-dev-server");
    }
    return sources;
}

var browserLoaders = [
    {
        test: /\.jsx?/,
        include: APP_DIR,
        exclude: /node_modules/,
        loader: "babel",
        query: {
            cacheDirectory: true
        }
    }
];

var browserPlugins = [
    new webpack.EnvironmentPlugin([
        "NODE_ENV",
        "RENDER_ENV"
    ])
];

var config = {
    entry: getEntrySources([
        "react-widgets-webpack!./react-widgets.config.js",
        "font-awesome-webpack!./font-awesome.config.js",
        APP_DIR + "/index.jsx"
    ]),
    output: {
        path: BUILD_DIR,
        publicPath: "/static/",
        filename: "scripts/bundle.js"
    },
    devServer: {
        contentBase: BUILD_DIR
    }
};

var browserConfig = Object.assign({}, baseConfig, config);
browserConfig.module.loaders.push(...browserLoaders);
browserConfig.plugins.push(...browserPlugins);

module.exports = browserConfig;
