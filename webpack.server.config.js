
var path = require("path");
var extractTextPlugin = require("extract-text-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "src/build/static");
const SERVER_DIR = path.resolve(__dirname, "src/backend-hapi");

module.exports = {
    cache: true,
    target: "node",
    node: {
        __dirname: false
    },
    entry: SERVER_DIR + "/start.js",
    output: {
        path: BUILD_DIR,
        publicPath: "/static/",
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
                loader: extractTextPlugin.extract("css!sass")
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
        new extractTextPlugin("styles/initial-render.css", {
            allChunks: true
        })
    ]
};