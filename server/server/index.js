const dbserver = require('../dao/dbserver')
//主页获取好友信息
exports.getUsers = function (req, res) {
  dbserver.getUsers(req.body, res)
}
// 获取一对一通信消息
exports.getOneMsg = function (req, res) {
  dbserver.getOneMsg(req.body, res)
}
// 获取数据库中的未读信息
exports.unreadMsg = function (req, res) {
  dbserver.unreadMsg(req.body, res)
}
// 将数据库中的信息置零
exports.updateMsg = function (req, res) {
  dbserver.updateMsg(req.body, res)
}
