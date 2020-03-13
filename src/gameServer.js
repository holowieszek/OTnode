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
    const db = new Database();

    msg.buffer = data;
    const protId = msg.getU16();

    if (protId === 0x0201) {
      msg.skipBytes(15)

      const accnumber = msg.getU32();
      const password = msg.getString();

      if (accnumber === 0 || password === '') {
        msg.addByte(0x0A);
        msg.addString('No account number or password.');
        socket.write(msg.buffer);
      } else {

        const account = await db.getAccount(accnumber, password);

        if (account.length > 0) {
          msg.reset();
          msg.addByte(0x64);

          msg.addByte(account.length);
          for (let i in account) {
            msg.addString(account[i].nickname);
            msg.addString('World');
            msg.addU32(0x0d58a8c0); // reversed 192.168.88.13 => 13.88.168.192
            msg.addU16(7171);
          }
          msg.addU16(12);

          socket.write(msg.buffer);
        } else {
          msg.reset()
          msg.addByte(0x0A);
          msg.addString('Invalid credentials.')
          socket.write(msg.buffer);
        }
      }
    } else {
      if (protId === 0x020A) {
        const clientOS = msg.getByte();
        const version = msg.getU16();
        const unknown = msg.getByte();
        const accnumber = msg.getU32();

        const nickname = msg.getString();
        const password = msg.getString();

        const isBanished = await db.isBanished(nickname);

        if (isBanished) {
          msg.reset()
          msg.addByte(0x14);
          msg.addString('Your character has been banished!');
          socket.write(msg.buffer);
        } else {
          msg.reset();
          msg.addByte(0xFF);
          socket.write(msg.buffer);

          msg.reset();
          msg.addByte(0xB4);
          msg.addByte(0x12);
          msg.addString('Hello world');
          socket.write(msg.buffer);
        }
      } else {
        console.log('Unknown packet.', protId)
      }
    }
  }

  onEnd() {
    return function() {
      console.log('Connection closed.')
    }
  }
}

module.exports = GameServer;