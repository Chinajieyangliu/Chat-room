const dbserver = require('../dao/dbserver')
// 实现好友之间聊天功能
exports.applyFriend = function (req, res) {
  let data = req.body
  dbserver.applyFriend(data, res)
}
// 更新好友状态
exports.updateFriendState = function (req, res) {
  let data = req.body
  dbserver.updateFriendState(data, res)
}
// 删除好友
exports.deleteFriendState = function (req, res) {
  let data = req.body
  dbserver.deleteFriendState(data, res)
}
