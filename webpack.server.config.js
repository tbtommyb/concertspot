require("env2")(__dirname + "/config.env");
var path = require("path");
var extractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

const BUILD_DIR = path.resolve(__dirname, "src/build/static");
const SERVER_DIR = path.resolve(__dirname, "src/backend-hapi");

process.env.BROWSER = false;

module.exports = {
    cache: true,
    target: "node",
    node: {
        __dirname: false
    },
    entry: [
        "react-widgets-webpack!./react-widgets.config.js",
        "font-awesome-webpack!./font-awesome.config.js",
        SERVER_DIR + "/start.js"
    ],
    output: {
        path: BUILD_DIR,
        publicPath: "/",
        filename: "../server.bundle.js",
        libraryTarget: "commonjs2"
    },
    externals: /^[a-z\-0-9]+$/,
    devtool: "eval-source-map",
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader"
            },
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
                test: /\.(css|scss|sass)$/,
                exclude: /node_modules/,
                loader: extractTextPlugin.extract("isomorphic-style-loader", "css!sass")
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    "url?limit=8192&name=images/[name].[ext]",
                    "img?minimize&optimizationLevel=5&progressive=true"
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=fonts/[name].[ext]"
            }
        ]
    },
    plugins: [
        new extractTextPlugin("styles/style.css", {
            allChunks: true
        }),
        new webpack.EnvironmentPlugin([
            "NODE_ENV",
            "BROWSER",
            "DB_URL",
            "DB_MAX_CONNECTIONS",
            "SK_KEY",
            "SK_URL"]
        )
    ]
};