const multer = require('multer')
const mkdir = require('..//..//dao/mkdir')

// 控制文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let url = req.body.url
    mkdir.mkdirs('../data/' + url, (err) => {})
    cb(null, './data/' + url)
  },
  filename: function (req, file, cb) {
    let name = req.body.name
    let type = file.originalname.replace(/.+\./, '.')
    cb(null, name + type)
  }
})
const upload = multer({ storage: storage })
module.exports = function (app) {
  app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
    let name = req.files[0].filename
    res.send(name)
  })
}
