const express = require('express')
// 引入解析前端数据的插件
const jwt = require('./dao/jwt')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

// 解析json格式的表单数据
app.use(bodyParser.json({ limit: '50mb' }))
// 获取静态路径
app.use(express.static(__dirname + '/data'))
app.use(cors())
// socket,io
const server = app.listen(8082)
const io = require('socket.io').listen(server)

require('./dao/socket_io')(io)
// 对用户携带token的判断
// app.use(function (req, res, next) {
//   if (typeof req.body.token != 'undefined') {
//     let token = req.body.token
//     let tokenMatch = jwt.verifToken(token)
//     if (tokenMatch == 1) {
//       next()
//     } else {
//       res.send({ status: 300 })
//     }
//   } else {
//     next()
//   }
// })
// 使用中间件处理服务端请求
require('./routes/admin/UserData')(app)
//
require('./routes/admin/files')(app)
// 开启视口监听
app.listen(3000, () => {
  console.log('3000窗口开启监听')
})
