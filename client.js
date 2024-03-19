#! /usr/bin/env node
'use strict';

const net = require('net');
const message = require('./message');

function recvData(data)
{
  console.log('got data:', data);
}

function printMessage(message)
{
  console.log('got message from server:', message);
}

function main()
{
  const port = 3024;
  const host = 'localhost';

  const md = new message.Decoder();
  md.on('message', printMessage);
  
  const sock = net.createConnection({host, port}, () => {
    console.log('connected to server');
    message.send(sock, Buffer.from('hello world'));
  });
  sock.on('data', data => md.recv(data));
  sock.on('end', () => 'socket disconnected');
  sock.on('error', (error) => console.log('socket error:', error));
}

process.on('unhandledError', (error) => console.error('unhandled error:', error));
main();
