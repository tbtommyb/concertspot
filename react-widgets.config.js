module.exports = {
    styleLoader: require("extract-text-webpack-plugin").extract("isomorphic-style-loader", "css-loader!less-loader"),
    styles: {
        "mixins": true,
        "normalize": true,
        "icons": true,
        "core": true,
        "popup": true,
        "datepicker": true,
        "selectlist": true,
        "multiselect": true
    }
};
