#! /usr/bin/env node
'use strict';

const net = require('net');
const message = require('./message');

function handleConnection(sock)
{
  const md = new message.Decoder();
  md.on('message', recvMessage => {
    console.log('got message from client:', recvMessage);
    message.send(sock, Buffer.from('goodbye'));
  });
  sock.on('data', data => md.recv(data));

  console.log('got new connection from client');
}

function main()
{
  const port = 3024;
  const host = 'localhost';
  const server = net.createServer(handleConnection);

  server.listen({port, host});
}

process.on('unhandledError', (error) => console.error('unhandled error:', error));
main();
