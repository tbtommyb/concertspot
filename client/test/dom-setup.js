const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { window } = new JSDOM("<!doctype html><html><body></body></html>");
const { document } = window.window;
global.window = window;
global.document = document;
global.navigator = {userAgent: "node.js"};
