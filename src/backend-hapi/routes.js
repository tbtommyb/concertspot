import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../app/routes.jsx';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import reducers from "../app/reducers";

module.exports = [
    {
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: () => {
                    let path = __dirname;
                    console.log(path);
                    return path;
                },
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
                    return reply(renderFullPage(markup));
                }
            );
        }
    }
];

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
        <link href="https://fonts.googleapis.com/css?family=Baloo+Paaji" rel="stylesheet">
        <link href="static/styles/initial-render.css" rel="stylesheet">
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src="static/scripts/bundle.js"></script>
      </body>
    </html>
    `
}