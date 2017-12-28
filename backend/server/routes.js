const Joi = require("joi");
const parallel = require("async/parallel");
const moment = require("moment");
const { fetchEvents, getGenresForQuery } = require("../tasks");
const { recommend } = require("../events");

module.exports = [
    {
        method: "GET",
        path: "/static/{param*}",
        handler: {
            directory: {
                path: __dirname + "/build/"
            }
        }
    },
    {
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: __dirname + "/views/"
            }
        }
    },
    {
        method: "POST",
        path: "/api/search",
        config: {
            validate: {
                payload: {
                    query: Joi.string().required(),
                    mindate: Joi.date().min(moment().format("YYYY-MM-DD")).required(),
                    maxdate: Joi.date().min(Joi.ref("mindate")).required(),
                    lat: Joi.number().min(-90.0).max(90.0).required(),
                    lng: Joi.number().min(-180.0).max(180.0).required(),
                    radius: Joi.number().min(1.0).max(9.0).required()
                }
            }
        },
        handler: (request, reply) => {
            parallel({
                events: (cb) => {
                    fetchEvents(request.payload, (err, events) => {
                        if(err) { return cb(err); }
                        cb(null, events);
                    });
                },
                genres: (cb) => {
                    getGenresForQuery(request.payload.query, (err, genres) => {
                        if(err) { return  cb(err); }
                        cb(null, genres);
                    });
                }
            }, (err, results) => {
                if(err) { return reply(err).statusCode(500); }
                return reply({events: recommend(results.events, results.genres)});
            });
        }
    }
];
