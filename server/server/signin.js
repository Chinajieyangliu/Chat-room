const dbserver = require('../dao/dbserver')
exports.singIn = function (req, res) {
  const { data, pwd } = req.body
  dbserver.userMatch(data, pwd, res)
}
