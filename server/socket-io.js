const socketIo = require('socket.io');

const SOCKET_CONNECT = 'connect';
const SOCKET_DISCONNECT = 'disconnect';


function registerHandlers(listener) {
  listener.sockets.on(SOCKET_CONNECT, (socket) => {
    console.log('client connected');

    socket.on(SOCKET_DISCONNECT, () => {
      console.log('client disconnected')
    })
  });
}


function init(httpServer) {
  const io = socketIo.listen(httpServer);

  registerHandlers(io);
}


module.exports = {
  init
};
