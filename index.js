/* Entry point for the API*/

// Dependencies
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const serverConfig = require('./config/server.json') || {};
const router = require('./routes').router || {};
const handlers = require('./routes').handlers || {};

// The server options and initialization
const httpsServerOptions = {
  key: fs.readFileSync('./config/https/key.pem'),
  cert: fs.readFileSync('./config/https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res) {

  // Get the URL and parse it
  let parsedUrl = url.parse(req.url, true);

  // Get the path from the URL
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP method
  let method = req.method.toUpperCase();

  // Get the headers as an object
  let headers = req.headers;

  // Get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let payload = '';

  req.on('data', (data) => {
    payload += decoder.write(data);
  });

  req.on('end', () => {
    payload += decoder.end();

    // Choose the handler this request should go to.
    let choosenHandler;
    if (typeof router[trimmedPath] !== 'undefined') {
      choosenHandler = router[trimmedPath];
    } else if (path === '/') {
      choosenHandler = handlers.root;
    } else {
      choosenHandler = handlers.notFound;
    }

    // Construct the data object to send to the handler
    let data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload
    }

    // Router the request to the handler specified in the router
    choosenHandler(data, (statusCode, payload) => {
      //  Use the status code called back the handler, or default 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      // Use the payload called back by the handler, or default empty object
      payload = typeof payload === 'object' ? payload : {};

      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.writeHead(statusCode, { 'Content-Type': 'application/json'});
      res.end(payloadString);
    });

  });

  // Log the request
  console.log('Request received on path: ' + trimmedPath + ' with method ' + method + ' and with these query string parameters:', queryStringObject);


});

// Final checks on serverConfig.port existance
serverConfig.port = serverConfig.port ? serverConfig.port : 3003;

// Start the server and have it listen on configured port
httpsServer.listen(serverConfig.port, function() {
  console.log(`The https server is listening on port ${serverConfig.port}`);
});
