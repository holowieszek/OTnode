// src/gameServer.js
const NetworkMessage = require('./networkMessage');

class GameServer {
  listen(server) {
    console.log('Listening...');

    server.on('connection', this.connection().bind(this));
  }

  connection() {
    console.log('Connection estabilished.');

    return function(socket) {
      try {
        socket.on('data', (data) => this.onData(socket, data));
        socket.on('end', this.onEnd());
      } catch (err) {
        console.log(err);
      }
    }
  }

  onData(socket, data) {
    const msg = new NetworkMessage();
    msg.buffer = data;

    console.log(msg.getU16());
  }

  onEnd() {
    return function() {
      console.log('Connection closed.')
    }
  }
}

module.exports = GameServer;