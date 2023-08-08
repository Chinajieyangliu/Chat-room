const dbModel = require('../model/dbModel')
const bcrypt = require('../dao/bcrypt')
const jwt = require('../dao/jwt')
const User = dbModel.model('User')
const Friend = dbModel.model('Friend')
const GroupUser = dbModel.model('GroupUser')
const Group = dbModel.model('Group')
const Message = dbModel.model('Message')

// 注册登录开始
exports.BuilderUser = function (name, mail, pwd, res) {
  // 密码加密
  let password = bcrypt.encryption(pwd)
  // 用户基本信息
  let data = {
    name: name,
    email: mail,
    pwd: password,
    time: new Date()
  }
  let user = new User(data)
  user.save(function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, result })
    }
  })
}
// 用户查询邮箱是否存在
exports.countUser = function (data, type, res) {
  let whereStr = {}
  whereStr[type] = data
  User.countDocuments(whereStr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, result })
    }
  })
}
// 验证用户账号密码是否正确(此处有token的设置)
exports.userMatch = function (data, pwd, res) {
  let whereStr = { $or: [{ name: data }, { email: data }] }
  let out = { name: 1, imgurl: 1, pwd: 1 }
  User.find(whereStr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 })
    } else {
      if (result == '') {
        res.send({ status: 400 })
      }
      result.map(function (e) {
        const pwdMatch = bcrypt.verification(pwd, e.pwd)
        if (pwdMatch) {
          let token = jwt.generateToken(e._id)
          let back = {
            id: e._id,
            name: e.name,
            imgurl: e.imgurl,
            token: token
          }
          res.send({ status: 200, back })
        } else {
          res.send({ status: 400 })
        }
      })
    }
  })
}

// 注册登录结束

// 搜索好友相关api开始

// 搜索好友
exports.searchUser = function (data, res) {
  let whereStr
  if (data == 'yike') {
    whereStr = {}
  } else {
    whereStr = { $or: [{ name: { $regex: data } }, { email: { $regex: data } }] }
  }
  let out = {
    name: 1,
    email: 1,
    imgurl: 1
  }
  User.find(whereStr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, result })
    }
  })
}

// 判断是否为好友
exports.isFriend = function (uid, fid, res) {
  let whereStr = { userID: uid, friendID: fid, state: 0 }

  Friend.findOne(whereStr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      if (result) {
        res.send({ status: 200, result })
      } else {
        res.send({ status: 400, result })
      }
    }
  })
}

// 搜索群
exports.searchGroup = function (data, res) {
  let whereStr
  if (data == 'yike') {
    whereStr = {}
  } else {
    whereStr = { name: { $regex: data } }
  }
  let out = {
    name: 1,
    imgurl: 1
  }
  Group.find(whereStr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, result })
    }
  })
}

// 判断是否是群友
exports.isInGroup = function (uid, gid, res) {
  let whereStr = { userID: uid, groupID: gid }

  GroupUser.findOne(whereStr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      if (result) {
        res.send({ status: 200 })
      } else {
        res.send({ status: 400 })
      }
    }
  })
}

// 搜索好友相关api结束

// 用户修改个人信息详情页开始

// 用户详情
exports.userDetial = function (id, res) {
  let whereStr = { _id: id }
  let out = { pwd: 0 }
  User.findOne(whereStr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, result })
    }
  })
}

// 将验证加修改定义成公用函数开始
function changeData(data, update, res) {
  User.findByIdAndUpdate(data, update, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}
// 将验证加修改定义成公用函数结束

// 用户信息修改（个人账号密码修改）
exports.userUpdata = function (data, res) {
  let whereStr = {}
  if (typeof data.pwd != 'undefined') {
    User.find({ _id: data.id }, { pwd: 1 }, (err, result) => {
      if (err) {
        res.send({ status: 500 })
      } else {
        if (result == '') {
          res.send({ status: 400 })
        }
        result.map(function (e) {
          const pwdMatch = bcrypt.verification(data.pwd, e.pwd)
          if (pwdMatch) {
            if (data.type == 'pwd') {
              let password = bcrypt.encryption(data.data)
              whereStr[data.type] = password
              changeData(data.id, whereStr, res) //将匹配的密码修改
            } else {
              whereStr[data.type] = data.data //对用户邮箱进行判断
              User.countDocuments(whereStr, function (err, result) {
                if (err) {
                  res.send({ status: 500 })
                } else {
                  if (result == 0) {
                    changeData(data.id, whereStr, res)
                  } else {
                    res.send({ status: 300 })
                  }
                }
              })
            }
          } else {
            res.send({ status: 400 })
          }
        })
      }
    })
  } else if (data.type == 'name') {
    whereStr[data.type] = data.data
    User.countDocuments(whereStr, function (err, result) {
      //对个人信息的用户名进行判断
      if (err) {
        res.send({ status: 500 })
      } else {
        if (result == 0) {
          changeData(data.id, whereStr, res)
        } else {
          res.send({ status: 300 })
        }
      }
    })
  } else {
    whereStr[data.type] = data.data
    changeData(data.id, whereStr, res)
  }
}

// 获取好友昵称
exports.getfriendMarkName = function (data, res) {
  let whereStr = { userID: data.uid, friendID: data.fid }
  let updatestr = { markname: 1 }
  Friend.findOne(whereStr, updatestr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, result })
    }
  })
}

// 用户修改个人信息详情页结束

// 修改好友昵称
exports.friendMarkName = function (data, res) {
  let whereStr = { userID: data.uid, friendID: data.fid }
  let updatestr = { markname: data.name }
  Friend.updateOne(whereStr, updatestr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}

// 添加好友表
exports.buildFriend = function (uid, fid, state) {
  let data = {
    userID: uid,
    friendID: fid,
    state: state,
    time: new Date(),
    lastTime: new Date()
  }
  let friend = new Friend(data)
  friend.save(function (err, res) {
    if (err) {
      console.log('添加好友失败')
    }
  })
}

// 建立好友关系通用函数开始
// 好友间最后通信时间
exports.upFriendLastTime = function (uid, fid) {
  let whereStr = {
    $or: [
      { userID: uid, friendID: fid },
      { userID: fid, friendID: uid }
    ]
  }
  let updatestr = { lastTime: new Date() }
  Friend.updateMany(whereStr, updatestr, function (err, result) {
    if (err) {
      console.log('更新好友通讯时间失败')
    }
  })
}
// 保存与好友的聊天信息
exports.inserMsg = function (uid, fid, msg, type, res) {
  let data = {
    userID: uid,
    friendID: fid,
    message: msg,
    types: type,
    time: new Date(),
    state: 1
  }
  let message = new Message(data)
  message.save(function (err, result) {
    if (err) {
      console.log('更新好友聊天记录失败')
    }
  })
}

// 建立好友关系通用函数结束

// 实现好友申请
// 好友申请
exports.applyFriend = function (data, res) {
  let whereStr = { userID: data.uid, friendID: data.fid }
  Friend.countDocuments(whereStr, (err, result) => {
    if (err) {
      res.send({ status: 500 })
    } else {
      if (result == 0) {
        this.buildFriend(data.uid, data.fid, 2)
        this.buildFriend(data.fid, data.uid, 1)
      } else {
        this.upFriendLastTime(data.uid, data.fid)
      }
      // 添加两人之间聊天消息
      this.inserMsg(data.uid, data.fid, data.msg, 0, res)
      res.send({ status: 200 })
    }
  })
}
// 更新好友状态
exports.updateFriendState = function (data, res) {
  let whereStr = {
    $or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid }
    ]
  }
  Friend.updateMany(whereStr, { state: 0 }, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}
// 删除好友
// 拒绝或删除好友
exports.deleteFriendState = function (data, res) {
  let whereStr = {
    $or: [
      { userID: data.uid, friendId: data.fid },
      { userID: data.fid, friendID: data.uid }
    ]
  }
  Friend.deleteOne(whereStr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}
// 好友申请结束

// 主页获取好友信息api开始

// 按要求获取好友列表
exports.getUsers = function (data, res) {
  let query = Friend.find({})
  // 查询条件
  query.where({ userID: data.uid, state: data.state })
  // 查找friend对象并关联user对象
  query.populate('friendID')
  // 通过给定事件戳进行排序
  query.sort({ lastTime: -1 })
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (item) {
        return {
          id: item.friendID._id,
          name: item.friendID.name,
          markname: item.markname,
          imgurl: item.friendID.imgurl,
          lastTime: item.lastTime
        }
      })
      res.send({ status: 200, result })
    })
    .catch(function (err) {
      res.send({ status: 500 })
    })
}

// 按要求获取一对一消息
exports.getOneMsg = function (data, res) {
  let query = Message.find({})
  // 查询条件
  query.where({
    $or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid }
    ]
  })
  // 通过给定事件戳进行排序
  query.sort({ time: -1 })
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (item) {
        return {
          message: item.message,
          imgurl: item.friendID.imgurl,
          time: item.time,
          types: item.types
        }
      })
      res.send({ status: 200, result })
    })
    .catch(function (err) {
      res.send({ status: 500 })
    })
}
// 汇总一对一消息
exports.unreadMsg = function (data, res) {
  let whereStr = { userID: data.fid, friendID: data.uid, state: 1 }
  Message.countDocuments(whereStr, (err, result) => {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200, result })
    }
  })
}

// 消除未读消息
exports.updateMsg = function (data, res) {
  let whereStr = { userID: data.uid, friendID: data.fid, state: 1 }
  let updatestr = { state: 0 }
  Message.updateMany(whereStr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 })
    } else {
      res.send({ status: 200 })
    }
  })
}

// 主页获取好友信息api结束

// 一对一分页后台处理开始

exports.msg = function (data, res) {
  let skipNum = data.newPage * data.pageSize //跳过的条数
  let query = Message.find({})
  query.where({
    $or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid }
    ]
  })
  query.populate('userID')
  // 对通讯录进行倒叙排序
  query.sort({ time: -1 })
  // 跳过条数
  query.skip(skipNum)
  // 一页条数
  query.limit(data.pageSize)
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (item) {
        return {
          message: item.message,
          types: item.types,
          id: item.userID._id,
          imgurl: item.userID.imgurl
        }
      })
      res.send({ status: 200, result })
    })
    .catch(function (err) {
      res.send({ status: 500 })
    })
}

// 一对一分页后台处理结束
