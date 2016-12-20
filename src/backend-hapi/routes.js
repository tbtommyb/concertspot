import React from "react";
import Joi from "joi";
import parallel from "async/parallel";
import moment from "moment";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import routes from "../app/routes.jsx";
import { Provider } from "react-redux";
import makeIndexView from "./views/Index.js";
import { fetchEvents, getGenresForQuery } from "./tasks";
import { recommend } from "./events";
import config from "../app/config.js";
import configureStore from "../app/stores";

module.exports = [
    {
        method: "GET",
        path: "/static/{param*}",
        handler: {
            directory: {
                path: __dirname + "/static/",
                listing: true,
                index: true
            }
        }
    },
    {
        method: "GET",
        path: "/{path*}",
        handler: (request, reply) => {
            match(
                {routes, location: request.url},
                (err, redirectLocation, renderProps) => {
                    if(err) { return reply("error"); }
                    if(redirectLocation) {
                        return reply.redirect(redirectLocation.pathname + redirectLocation.search).statusCode(302);
                    }
                    if(!renderProps) {
                        throw new Error("no renderProps");
                        // TODO better error handling
                    }

                    const store = configureStore({
                        splashImage: config.getRandomSplashImage()
                    });

                    let markup;
                    if(renderProps) {
                        markup = renderToString(
                            <Provider store={store}>
                                <RouterContext {...renderProps}/>
                            </Provider>
                        );
                    } else {
                        reply("Not found").statusCode(404);
                    }
                    return reply(makeIndexView(markup, store.getState()));
                }
            );
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
