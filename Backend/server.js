require('dotenv').config();
const http = require('http');
const app = require('./app');

app.set('port', process.env.PORT || 4000)

const server = http.createServer(app);

server.listen (process.env.PORT || 4000)

console.log('Server started!', process.env.PORT)