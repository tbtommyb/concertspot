import React from "react";
import Joi from "joi";
import parallel from "async/parallel";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import routes from "../app/routes.jsx";
import { Provider } from "react-redux";
import makeIndexView from "./views/Index.js";
import { fetchEvents, getGenresForQuery } from "./tasks";
import { recommend } from "./events"; // Make into a task?
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
                    //const components = renderProps.components;
                    //const Comp = components[components.length - 1].WrappedComponent;

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
                    mindate: Joi.string().required(),
                    maxdate: Joi.string().required(),
                    lat: Joi.number().required(),
                    lng: Joi.number().required(),
                    radius: Joi.number().required()
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
                if(err) { return reply(err); }
                return reply({events: recommend(results.events, results.genres)});
            });
        }
    }
];
