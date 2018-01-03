var webpack = require("webpack");
var browserConfig = require("./webpack.browser.config.js");

var config = {
    devtool: "source-map",
};

var productionPlugins = [
    new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify("production")
        }
    }),
];

var productionConfig = Object.assign({}, browserConfig, config);
productionConfig.plugins.push(...productionPlugins);

module.exports = productionConfig;
