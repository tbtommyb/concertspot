const request = require("request");

require("env2")(__dirname + "/../../config.env");

export const fetch = (query, cb) => {
    if(!process.env.SK_URL || !process.env.SK_KEY) {
        throw new Error("Skiddle URL or key not provided");
    }
    const { mindate, maxdate, lat, lng, radius } = query;
    const events = [];
    const params = {
        api_key: process.env.SK_KEY,
        minDate: mindate,
        maxDate: maxdate,
        "eventcodes[]": ["CLUB", "LIVE"], // TODO check this is working with the qsStringifyOptions
        latitude: lat,
        longitude: lng,
        radius: radius,
        order: 4,
        limit: 100
    };
    const stringifyOptions = {
        arrayFormat: "brackets"
    };
    request.get({url: process.env.SK_URL, qs: params, qsStringifyOptions: stringifyOptions}, (err, response, body) => {
        if(err) return cb(err);
        console.log(response.path)
        const resp = JSON.parse(body);
        events[0] = resp.results;
        const callsToMake = Math.floor(parseInt(resp.totalcount, 10) / 100); // check this gives integer
        if(!callsToMake) { return cb(null, [].concat.apply([],events)); }

        let completionCount = 0;
        for(let i = 1; i <= callsToMake; i++) {
            request.get({url: process.env.SK_URL, qs: Object.assign({}, params, {offset: 100 * i})},
                (err, response, body) => {
                    let resp = JSON.parse(body);
                    events[i] = resp.results;
                    completionCount++;
                    if(completionCount === callsToMake) {
                        cb(null, [].concat.apply([],events));
                    }
                });
        }
        
    });
};
/*
fetch({
    mindate: "2016-12-07",
    maxdate: "2016-12-10",
    lat: 51.508386,
    lng: -0.125382,
    radius: 0.8
}, (err, result) => {
    if(err) { console.log("Err", err); }
});*/

// TODO - filter events
