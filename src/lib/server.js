'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser');
const faker = require('faker');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.write(`<!DOCTYPE html>
          <html>
            <head>
              <title> cowsay </title>
            </head>
            <body>
             <header>
               <nav>
                 <ul>
                   <li><a href="/cowsay">cowsay</a></li>
                 </ul>
               </nav>
             <header>
             <main>
             The server module is responsible for creating an http server defining all route behavior and exporting an interface for starting and stoping the server. It should export an object with `start` and `stop` methods. The start and stop methods should each return a promise that resolves on success and rejects on error.
             </main>
            </body>
          </html>`);
        res.end();
        return undefined;
      }
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/cowsay?text={message}') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        res.write(`<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
            <h1> cowsay </h1>
            <pre>
              ${cowsayText}
            </pre>
          </body>
        </html>`);
        res.end();
        return undefined;
      }
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/cowsay') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const cowsayText = faker.lorem.text;
        res.write(`<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>
          </head>
          <body>
            <h1> cowsay </h1>
            <pre>
              ${cowsayText}
            </pre>
          </body>
        </html>`);
        res.end();
        return undefined;
      }
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsay?text={message}') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const cowsayText = cowsay.say({ text: parsedRequest.url.query.text });
        res.write(JSON.stringify({ 
          content: cowsayText
        }));
        res.end();
        return undefined;
      }
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsay?') {
        res.writeHead(404, { 'content-type': 'text/html' });
        const requestErrorMessage = "invalid request: text query required";
        res.write(JSON.stringify({
          error: requestErrorMessage
        }));
        res.end();
        return undefined;
      }
      // The req.body is handled in bodyParser
      if (parsedRequest.method === 'POST' && parsedRequest.url.pathname === '/api/cowsay') {
        const cowsayText = {
          text: JSON.stringify(parsedRequest.body),
        };
        res.writeHead(200, { 'content-type': 'application/json' });
        res.write(cowsay.say(cowsayText));
        res.end();
        return undefined;
      }
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();

      return undefined;
    })
    .catch((err) => {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.write('BAD REQUEST', err);
      res.end();
      return undefined;
    });
});

server.start = (port, callback) => app.listen(port, callback);
server.start = callback => app.close(callback);
