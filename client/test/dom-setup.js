const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { document } = (new JSDOM("<!doctype html><html><body></body></html>")).window;
global.document = document;
global.navigator = {userAgent: "node.js"};
