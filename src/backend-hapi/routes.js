import React from "react";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import routes from "../app/routes.jsx";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import reducers from "../app/reducers";
import makeIndexView from "./views/Index.js";
import { fetch } from "./events";

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
        handler: (request, reply) => {
            console.log(request.payload);
            fetch(request.payload, (err, result) => {
                if(err) { return reply(err); }
                reply(result);
            });
        }
    }
];
