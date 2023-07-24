const dbserver = require('../dao/dbserver')
// 个人用户详情
exports.userDetail = function (req, res) {
  const { id } = req.body
  dbserver.userDetial(id, res)
}
// 修改个人信息
exports.userUpdate = function (req, res) {
  dbserver.userUpdata(req.body, res)
}

// 获取好友昵称
exports.getfriendMarkName = function (req, res) {
  dbserver.getfriendMarkName(req.body, res)
}

// 修改好友昵称
exports.friendMarkName = function (req, res) {
  dbserver.friendMarkName(req.body, res)
}
