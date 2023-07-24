var mongoose = require('mongoose')
var db = require('../config/db')
var Schema = mongoose.Schema
// 用户表
var SchemaUser = new Schema({
  name: { type: String }, //用户名
  pwd: { type: String }, //密码
  email: { type: String }, //邮箱
  sex: { type: String, default: 'asexual' }, //性别
  birth: { type: Date }, //生日
  phone: { type: Number }, //电话
  explain: { type: String }, //介绍
  imgurl: { type: String, default: 'user.png' }, //用户头像
  time: { type: Date } //注册时间
})
// 好友表
var FriendsSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户Id
  friendID: { type: Schema.Types.ObjectId, ref: 'User' }, //好友Id
  markname: { type: String },
  state: { type: String }, //好友状态
  time: { type: Date }, //生成时间
  lastTime: { type: Date }
})
// 一对一消息表
var MessageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户Id
  friendID: { type: Schema.Types.ObjectId, ref: 'User' }, //好友Id
  message: { type: String }, //内容信息（文字内容为0 图片内容为1，语音内容为2）
  types: { type: String },
  state: { type: Number }, //消息状态
  time: { type: Date } //生成时间
})

// 群表
var GroupSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户Id
  name: { type: String }, //群名称
  imgurl: { type: String, default: 'group.png' }, //群头像
  time: { type: Date }, //群时间
  notice: { type: String }, //群公告
  lastTime: { type: Date }
})
// 群成员表
var GroupUserSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' }, //用户Id
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户Id
  name: { type: String }, //群名称
  tip: { type: Number, default: 0 },
  time: { type: Date }, //群时间
  notice: { type: Number } //是否屏蔽群
})

//群表消息
var GroupMsgSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' }, //群Id
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //群Id
  message: { type: String }, //群名称
  time: { type: Date }, //群时间
  state: { type: Number }, //是否屏蔽群
  types: { type: String }
})
module.exports = db.model('User', SchemaUser)
module.exports = db.model('Friend', FriendsSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupUser', GroupUserSchema)
module.exports = db.model('GroupMsg', GroupMsgSchema)
