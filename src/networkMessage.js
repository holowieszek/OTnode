// src/networkMessage.js
class NetworkMessage {
  constructor() {
    this.buffer = [];
    this.offset = 2;
  }

  getU16() {
    const v = (this.buffer[this.offset] | (this.buffer[this.offset + 1] << 8))
    this.offset += 2;
    return v;
  }

  reset() {
    this.offset = 0;
  }
}

module.exports = NetworkMessage;