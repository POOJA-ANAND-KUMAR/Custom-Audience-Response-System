// Need Local install of parcel-bundler so we and import it below.
const Bundler = require('parcel-bundler');
const express = require('express');
const config = require('../configAddrPorts.json');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();


// Trying to set up websocket proxy
// createProxyMiddleware('ws://echo.websocket.org');
app.use(['/login', '/logout', '/setCourse', '/course'], createProxyMiddleware({ target:`http://${config.wsServer}:${config.wsPort}`}));
// app.use(['/login', '/test1'], createProxyMiddleware({ target:`http://127.0.0.1:8999`}));

const wsURL = `ws://${config.wsServer}:${config.wsPort}`;
app.use(config.wsPath, createProxyMiddleware(wsURL, {xfwd: true}));

// Instance of the parcel.js bundler with start file
const bundler = new Bundler('./index.html');
app.use(bundler.middleware());
app.listen(config.devPort, config.devHost, function(){
  console.log(`listening at ${config.devHost}, port: ${config.devPort}`);
});