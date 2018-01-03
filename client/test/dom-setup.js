const jsdom = require("jsdom");
const fetch = require("node-fetch");
const fetchAbsolute = require("fetch-absolute");
const Adapter = require("enzyme-adapter-react-16");
const { configure } = require("enzyme");

const { JSDOM } = jsdom;
const { window } = new JSDOM("<!doctype html><html><body></body></html>");
const { document } = window.window;

global.window = window;
global.document = document;
global.navigator = {userAgent: "node.js"};
global.HTMLElement = window.HTMLElement;
global.fetch = fetchAbsolute(fetch)("http://localhost:8080");

configure({ adapter: new Adapter() });
