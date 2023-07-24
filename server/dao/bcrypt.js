const bcrypt = require('bcrypt')
// 生成hash密码
exports.encryption = function (e) {
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(e, salt)
  return hash
}
// 解密过程
exports.verification = function (e, hash) {
  let verif = bcrypt.compareSync(e, hash)
  return verif
}
