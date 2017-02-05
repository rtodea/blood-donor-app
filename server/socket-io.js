const socketIo = require('socket.io');

const SOCKET_CONNECT = 'connection';
const SOCKET_DISCONNECT = 'disconnect';


function registerHandlers(io) {
  // const ioNameSpace = io.of('/generic');
  io.on(SOCKET_CONNECT, (socket) => {
    console.log(`client connected on ${socket.id}`);

    socket.on(SOCKET_DISCONNECT, () => {
      console.log(`client disconnected from ${socket.id}`)
    })
  });
}


function init(httpServer) {
  const io = socketIo(httpServer);
  registerHandlers(io);
  return io;
}


module.exports = {
  init
};
