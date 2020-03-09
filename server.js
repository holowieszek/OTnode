// server.js
const net = require('net');
const GameServer = require('./src/gameServer');
const PORT = 7171;

const server = net.createServer();
const gameServer = new GameServer();

server.listen(PORT, gameServer.listen(server))