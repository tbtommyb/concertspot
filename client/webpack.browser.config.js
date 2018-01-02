var path = require("path");
var webpack = require("webpack");
var htmlWebpackPlugin = require("html-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "build");
const APP_DIR = path.resolve(__dirname, "src");

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
        use: [
            {
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                }
            },
        ],
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
browserConfig.module.rules.push(...browserLoaders);
browserConfig.plugins.push(...browserPlugins);

module.exports = browserConfig;
