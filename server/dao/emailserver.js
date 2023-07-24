var nodemailer = require('nodemailer')
var credentials = require('../config/credentials')
// 创建传输方式
var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass
  }
})

// 注册发送邮件给用户
exports.emailSignUp = function (email, res) {
  let options = {
    from: '2043804240@qq.com',
    to: email,
    subject: '感谢你的注册',
    html: '<span>欢迎你的加入</span>  <a href="">点击</a>'
  }
  transporter.sendMail(options, function (err, msg) {
    if (err) {
      res.send('邮箱发送失败', err)
    } else {
      res.send('邮箱发送成功')
      console.log('邮箱发送成功')
    }
  })
}
