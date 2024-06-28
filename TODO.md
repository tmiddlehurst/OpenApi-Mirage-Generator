Handle allOf etc.

Handle $refs by replacing with model where necessary

- format each file before writing
- factory imports are not dynamic
- handler imports to server.js are not quoted
- routes in routes:
  - need to have a semicolon
  - need to be in quotes
  - are using the path twice instead of path, handler
  - looks like body generation is not working for handlers
