const dbserver = require('../dao/dbserver')
// 搜索专用接口
exports.searchUser = function (req, res) {
  dbserver.searchUser(req.body.data, res)
}
// 判断是否为好友
exports.isFriend = function (req, res) {
  const { uid, fid } = req.body
  dbserver.isFriend(uid, fid, res)
}

// 判断是否在群
exports.searchGroup = function (req, res) {
  dbserver.searchGroup(req.body.data, res)
}
// 判断是否为群好友
exports.isGroupFriend = function (req, res) {
  const { uid, gid } = req.body
  dbserver.isInGroup(uid, gid, res)
}
