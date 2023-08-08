const dbserver = require('../dao/dbserver')
module.exports = function (io) {
  let users = {}
  io.on('connection', (socket) => {
    // 用户初访问事件开始
    socket.on('login', (id) => {
      socket.name = id
      users[id] = socket.id
      socket.emit('login', socket.id)
    })
    socket.on('msg', (msg, fromId, toId) => {
      dbserver.inserMsg(fromId, toId, msg.message, msg.types)
      // socket.emit(msg, fromId, toId)
      if (users[toId]) {
        socket.to(users[toId]).emit('msg', msg, fromId, 1)
      }
      socket.emit('msg', msg, toId, 0)
    })
    socket.on('disconnecting', () => {
      if (users.hasOwnProperty(socket.name)) {
        delete users[socket.name]
      }
    })
    // 用户初访问事件结束
  })
}
