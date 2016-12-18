module.exports = (html, preloadedState) => { return `
<!DOCTYPE html>
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
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBpmIDzWPhT6E3KFNfnKUbFy_5uhmh-No0&region=GB"></script>
        <script src="static/scripts/bundle.js"></script>
    </body>
</html>`;
};