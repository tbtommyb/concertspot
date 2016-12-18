module.exports = (html, preloadedState) => { return `
<!DOCTYPE html>
<html>
    <head>
        <title>ConcertSpot | Find the perfect gig</title>
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
        <script>
            (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,"script","https://www.google-analytics.com/analytics.js","ga");
            ga("create", "UA-84310914-1", "auto");
            ga("send", "pageview");
        </script>
    </body>
</html>`;
};