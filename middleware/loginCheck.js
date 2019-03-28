const { errorModel } = require('../model/resModel')

function loginCheck (req, res, next) {
  if (req.session.username) {
    next()
  } else {
    res.json(errorModel('未登录'))
  }
}

module.exports = loginCheck
