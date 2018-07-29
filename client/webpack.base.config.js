var config = {
    cache: true,
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            outputPath: "images",
                        },
                    },
                    {
                        loader: "img-loader",
                        options: {
                            optimizationLevel: 5,
                            progressive: true,
                        },
                    }
                ],
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            outputPath: "fonts",
                            mimetype: "application/font-woff",
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "fonts",
                        },
                    },
                ],
            }
        ]
    },
};

module.exports = config;
