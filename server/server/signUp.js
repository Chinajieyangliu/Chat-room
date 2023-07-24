const { BuilderUser, countUser } = require('../dao/dbserver')
const email = require('../dao/emailserver')
// 进行解构赋值，将前端发起请求数据处理
exports.signUp = function (req, res) {
  const { name, mail, pwd } = req.body
  // 向邮箱发送邮件
  email.emailSignUp(mail, res)
  BuilderUser(name, mail, pwd, res)
}
// 查询用户邮箱信息交由数据库处理
exports.judgeValue = function (req, res) {
  const { data, type } = req.body
  countUser(data, type, res)
}
