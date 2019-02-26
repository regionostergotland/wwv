var server = require('pushstate-server');
 
const port = 3000;
const host = "localhost";
server.start({
  port: port,
  directory: '.',
  host: host
});

console.log(`Starting dev-server at ${host}:${port}`);