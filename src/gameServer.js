// src/gameServer.js
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
    console.log(data);
  }

  onEnd() {
    return function() {
      console.log('Connection closed.')
    }
  }
}

module.exports = GameServer;