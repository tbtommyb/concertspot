module.exports = function(config) {
    config.set({
        client: {
            captureConsole: true,
            mocha: {
                bail: true
            }
        }
    });
};
