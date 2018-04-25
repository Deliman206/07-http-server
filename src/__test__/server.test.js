'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

beforeAll(() => server.start(5000));
afterAll(() => server.stop());
// https://localhost:300/time
describe('VALID request to the API', () => {
  describe('GET /', () => {
    it('Should response with a status 200', () => {
      return superagent.get(':5000/')
        .then((res) => {
          console.log(res);
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('html');
        });
    });
  });
  describe('GET /cowsay', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockHtml = `<!DOCTYPE html>
    <html>
      <head>
        <title> cowsay </title>
      </head>
      <body>
        <h1> cowsay </h1>
        <pre>
          ${mockCow}
        </pre>
      </body>
    </html>`;
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.get(':5000/cowsay')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockHtml);
        });
    });
  });
  describe('POST /api/cowsay', () => {
    it('should return status 200 for POST', () => {
      return superagent.post(':5000/api/cowsay')
        .set('content-type', 'application/json') // needs formatting
        .send('', '') // needs formating
        .then((res) => {
          console.log(res.body);
          console.log(res.status);
        });
    });
  });
});
describe('INVALID request to the API', () => {
  describe('GET /cowsay?', () => {
    it('should err out with a 404 status code for not sending text in query', () => {
      return superagent.get('5000/cowsay?')
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.stats).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
  });
});
