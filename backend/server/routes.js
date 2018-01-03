const Joi = require("joi");
const parallel = require("async/parallel");
const moment = require("moment");
const { fetchEvents, getGenresForQuery } = require("../lib/tasks");
const { recommend } = require("../lib/events");

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
            file: __dirname + "/views/index.html"
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
        handler: async (request, h) => {
            const events = await fetchEvents(request.payload);
            const genres = await getGenresForQuery(request.payload.query);

            return { events: recommend(events, genres) };
        }
    }
];
