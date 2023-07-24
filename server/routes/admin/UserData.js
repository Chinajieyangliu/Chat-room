const dbserver = require('../../dao/dbserver')
const credentials = require('../../dao/emailserver')
const { signUp, judgeValue } = require('../../server/signUp')
const signin = require('../../server/signin')
const search = require('../../server/search')
const userdetail = require('../../server/userdetail')
const friend = require('../../server/friend')
const index = require('../../server/index')
const chat = require('../../server/chat')
module.exports = (app) => {
  app.post('/mail', (req, res) => {
    let mail = req.body.mail
    credentials.emailSignUp(mail, res)
  })
  // 用户添加个人信息数据
  app.post('/signup/add', (req, res) => {
    signUp(req, res)
  })
  // 用户查询邮箱是否存在
  app.post('/signup/jduge', (req, res) => {
    judgeValue(req, res)
  })
  // 查询是否存在该用户信息
  app.post('/signin/match', (req, res) => {
    signin.singIn(req, res)
  })
  // 搜索好友
  app.post('/search/user', (req, res) => {
    search.searchUser(req, res)
  })
  // 判断是否是好友
  app.post('/search/isfriend', (req, res) => {
    search.isFriend(req, res)
  })
  // 搜索群
  app.post('/search/group', (req, res) => {
    search.searchGroup(req, res)
  })
  // 判断是否是群好友
  app.post('/search/isingroup', (req, res) => {
    search.isGroupFriend(req, res)
  })
  // 查看用户详情
  app.post('/user/detail', (req, res) => {
    userdetail.userDetail(req, res)
  })
  // 对用户数据进行修改
  app.post('/user/update', (req, res) => {
    userdetail.userUpdate(req, res)
  })
  // 修改好友昵称
  app.post('/user/updatemarkname', (req, res) => {
    userdetail.friendMarkName(req, res)
  })
  // 获取好友昵称
  app.post('/user/friendnickname', (req, res) => {
    userdetail.getfriendMarkName(req, res)
  })
  // 发起好友申请
  app.post('/friend/applyFriend', (req, res) => {
    friend.applyFriend(req, res)
  })
  // 改变好友状态（好友申请同意）
  app.post('/friend/updatestate', (req, res) => {
    friend.updateFriendState(req, res)
  })
  // 删除某些好友
  app.post('/friend/deletestate', (req, res) => {
    friend.deleteFriendState(req, res)
  })
  // 获取好友信息
  app.post('/index/getUsers', (req, res) => {
    index.getUsers(req, res)
  })
  // 获取通话消息
  app.post('/index/getOneMsg', (req, res) => {
    index.getOneMsg(req, res)
  })
  // 获取获取未读消息
  app.post('/index/unreadMsg', (req, res) => {
    index.unreadMsg(req, res)
  })
  // 消除未读消息
  app.post('/index/updateMsg', (req, res) => {
    index.updateMsg(req, res)
  })
  // 对聊天进行分页操作
  app.post('/chat/msg', (req, res) => {
    chat.msg(req, res)
  })
}
