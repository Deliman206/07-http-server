'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

beforeAll(() => server.start(5000));
afterAll(() => server.stop());
describe('VALID request to the API', () => {
  describe('GET /', () => {
    it('Should response with a status 404 for Bad URL', () => {
      return superagent.get(':5000/home')
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
    it('Should response with a status 200 for HomePage', () => {
      return superagent.get(':5000')
        .then((res) => {
          expect(res.status).toEqual(200);
        });
    });
    it('Should have a description of the Lab on the HomePage', () => {
      return superagent.get(':5000/')
        .then((res) => {
          expect(res.text).toEqual(`<!DOCTYPE html>
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
             The server module is responsible for creating an http server defining all route behavior and exporting an interface for starting and stoping the server. It should export an object with start and stop methods. The start and stop methods should each return a promise that resolves on success and rejects on error.
             </main>
            </body>
          </html>`);
        });
    });
  });
  describe('GET /cowsay ', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockHtml = 
    `<!DOCTYPE html>
          <html>
            <head>
              <title> cowsay </title>
            </head>
            <body>
              <h1> cowsay </h1>
              <pre>${mockCow}</pre>
            </body>
          </html>`;

    it('should err out with a 404 status code for not sending text in query', () => {
      return superagent.get(':5000/cowsay')
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
    it('should respond with status 200', () => {
      return superagent.get(':5000/cowsay')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
        });
    });
    it('should respond with cow text Hello World', () => {
      return superagent.get(':5000/cowsay')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.text).toEqual(mockHtml);
        });
    });
  });
  describe('GET /api/cowsay', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    it('Should Return status 200 for successful request', () => {
      return superagent.get(':5000/api/cowsay')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
        });
    });
    it('Should Return status 400 for request with no Query', () => {
      return superagent.get(':5000/api/cowsay')
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    it('Should Return Cow saying Hello World for successful request', () => {
      return superagent.get(':5000/api/cowsay')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(JSON.stringify(res.body.content)).toEqual(JSON.stringify(mockCow));
        });
    });
  });
  describe('POST /api/cowsay', () => {
    it('Should return status 200 for POST', () => superagent.post(':5000/api/cowsay')
      .set('Content-Type', 'application/json')
      .send({ text: 'HelloWorld' })
      .then((res) => {
        expect(res.status).toEqual(200);
      }));
    it('Should return HTML body Cow & Text for POST', () => {
      const mockCow = cowsay.say({ text: 'Hello World' });
      return superagent.post(':5000/api/cowsay')
        .set('Content-Type', 'application/json')
        .send({ text: 'Hello World' })
        .then((res) => {
          expect(res.body).toMatch(mockCow);
        });
    });
    it('Should Return status 400 for request with no Query', () => {
      return superagent.post(':5000/api/cowsay')
        .send({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    }); 
  });
});
