
var webpack = require("webpack");
var config = require("./webpack.config.js");

//require("env2")(__dirname + "/config.env");

config.devtool = "source-map";
config.plugins.push(
    new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify("production")
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: true
        }
    })
);

module.exports = config;
