var mongoose = require('mongoose')
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/chatRoom', { useNewUrlParser: true })
module.exports = db
