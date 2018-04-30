## Feature Tasks
For this assignment you will be building a HTTP server.
#### Server Module
The server module is responsible for creating an http server defining all route behavior and exporting an interface for starting and stoping the server. It should export an object with `start` and `stop` methods. The start and stop methods should each return a promise that resolves on success and rejects on error.

## Implementation
This server module allows the display of a cow to say text that is sent via a `POST` or `GET` method. 