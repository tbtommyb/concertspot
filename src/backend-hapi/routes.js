import React from "react";
import Joi from "joi";
import parallel from "async/parallel";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import routes from "../app/routes.jsx";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import reducers from "../app/reducers";
import makeIndexView from "./views/Index.js";
import { fetchEvents, getGenresForQuery } from "./tasks";
import { recommend } from "./events"; // Make into a task?

module.exports = [
    {
        method: "GET",
        path: "/{param*}",
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
        path: "/",
        handler: (request, reply) => {
            match(
                {routes, location: request.url},
                (err, redirectLocation, renderProps) => {
                    if(err) { return reply("error"); }
                    if(redirectLocation) {
                        return reply.redirect(redirectLocation.pathname + redirectLocation.search).statusCode(302);
                    }

                    const initialState = {};
                    const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));

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
                    return reply(makeIndexView(markup, initialState));
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
