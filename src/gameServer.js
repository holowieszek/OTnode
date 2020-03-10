// src/gameServer.js
const NetworkMessage = require('./networkMessage');
const Database = require('./database');

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
  
  async onData(socket, data) {
    const msg = new NetworkMessage();
    msg.buffer = data;
    const protId = msg.getU16();
    
    if (protId === 0x0201) {
      msg.skipBytes(15)

      const accnumber = msg.getU32();
      const password = msg.getString();

      console.log({ accnumber, password });
      const db = new Database();

      const account = await db.getAccount(accnumber, password);

      console.log(account);

    } else {
      console.log('Unknown packet.')
    }
  }

  onEnd() {
    return function() {
      console.log('Connection closed.')
    }
  }
}

module.exports = GameServer;