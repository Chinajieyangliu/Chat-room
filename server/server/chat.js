const dbserver = require('../dao/dbserver')
exports.msg = function (req, res) {
  dbserver.msg(req.body, res)
}
