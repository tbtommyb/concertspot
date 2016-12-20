var extractTextPlugin = require("extract-text-webpack-plugin");

require("env2")(__dirname + "/config.env");

var config = {
    cache: true,
    devtool: "eval-source-map",
    module: {
        loaders: [
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
        })
    ]
};

module.exports = config;
