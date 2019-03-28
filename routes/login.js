const express = require('express')
const router = express.Router()

const { successModel, errorModel } = require('../model/resModel')
const { login } = require('../controller/login') 

router.post('/', (req, res, next) => {
  const { username, password } = req.body

  login(username, password).then(data => {
    if (data.username) {
      req.session.username = data.username
      req.session.realname = data.realname
      
      res.json(successModel(data))
    } else {
      res.json(errorModel('登录失败'))
    }
  })
})

router.get('/test', (req, res, next) => {
  if (req.session.username) {
    res.json({
      errno: 0,
      message: '已登录'
    })
  } else {
    res.json({
      errno: -1,
      msg: '未登录'
    })
  }
})

module.exports = router
