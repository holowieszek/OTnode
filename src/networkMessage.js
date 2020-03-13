// src/networkMessage.js
class NetworkMessage {
  constructor() {
    this.buffer = [];
    this.offset = 2;
  }

  getU16() {
    const v = (this.buffer[this.offset] | (this.buffer[this.offset + 1] << 8));
    this.offset += 2;
    return v;
  }

  reset() {
    this.offset = 2;
  }

  addByte(value) {
    this.buffer[this.offset] = value & 0xFF;
    ++this.offset;
  }

  addU16(value) {
    this.buffer[this.offset++] = value;
    this.buffer[this.offset++] = value >> 8;
  }

  addString(str) {
    this.addU16(str.length);

    for (let i = 0; i < str.length; ++i) {
      this.addByte(str.charCodeAt(i));
    }
  }
  
  skipBytes(count) {
    this.offset += count;
  }
  
  getByte() {
    return this.buffer[this.offset++];
  }

  getU32() {
    const v = ((
      this.buffer[this.offset]) |
      (this.buffer[this.offset+1] << 8) |
      (this.buffer[this.offset+2] << 16) |
      (this.buffer[this.offset+3] << 24));
    this.offset += 4;
    return v;
  }

  getString() {
    const stringlen = this.getU16();

    let v = '';
    for (let i = 0; i < stringlen; ++i) {
      v += String.fromCharCode(this.getByte());
    }    

    return v;
  }

  addU32(value) {
    value &= 0xFFFFFFFF;
    this.buffer[this.offset++] = value & 0xFF;
    this.buffer[this.offset++] = (value >> 8) & 0xFF;
    this.buffer[this.offset++] = (value >> 16) & 0xFF;
    this.buffer[this.offset++] = (value >> 24) & 0xFF;
  }
}

module.exports = NetworkMessage;