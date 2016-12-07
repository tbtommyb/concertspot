
var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
var extractTextPlugin = require("extract-text-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, "src/build/static");
const APP_DIR = path.resolve(__dirname, "src/app");

function getEntrySources(sources) {
    if(process.env.NODE_ENV === "serve") {
        sources.push("webpack-dev-server/client?http://localhost:8080");
        sources.push("webpack/hot/only-dev-server");
    }
    return sources;
}

var config = {
    cache: true,
    entry: getEntrySources([
        "react-widgets-webpack!./react-widgets.config.js",
        APP_DIR + "/index.jsx"
    ]),
    output: {
        path: BUILD_DIR,
        publicPath: "/",
        filename: "scripts/bundle.js"
    },
    devServer: {
        contentBase: BUILD_DIR,
        proxy: {
            "/api/**": {
                target: "http://localhost:5000",
                changeOrigin: true
            }
        }
    },
    devtool: "eval-source-map",
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
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
        new htmlWebpackPlugin({
            filename: "index.html",
            template: APP_DIR + "/index.html",
            favicon: APP_DIR + "/favicon.png"
        }),
        new extractTextPlugin("styles/style.css", {
            allChunks: true
        })
    ]
};

module.exports = config;
