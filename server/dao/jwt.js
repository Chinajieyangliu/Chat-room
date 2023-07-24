const jwt = require('jsonwebtoken')
const secret = 'liuhao6676'

// 生成token
exports.generateToken = function (e) {
  let payload = { id: e, time: new Date() }
  let token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 365 })
  return token
}
// 对生成的token进行解密
exports.verifToken = function (e) {
  let payload = jwt.verify(e, secret, function (err, result) {
    if (err) {
      payload = 0
    } else {
      payload = 1
    }
  })
  return payload
}
