'use strict';

const { EventEmitter } = require('events');

/* consume socket data, building a message in a buffer; when whole message is received, call callback */
class Decoder extends EventEmitter
{
  constructor()
  {
    super();
    this.buf = false;
  }

  recv(data, callback)
  {
    for (let i=0; i < data.length; i++)
    {
      if (this.buf)
        this.buf[this.count++] = data[i];
      else
      {
        this.count = 0;
        this.buf = new Buffer.allocUnsafe(data[i]);
      }
      
      if (this.count === this.buf.length)
      {
        this.emit('message', this.buf);
        this.buf = false;
      }
    }
  }
}

function send(sock, message)
{
  const lenBuf = new Buffer.allocUnsafe(1);
  lenBuf[0] = message.length;
  
  sock.write(lenBuf);
  sock.write(message);
}

exports.Decoder = Decoder;
exports.send = send;
