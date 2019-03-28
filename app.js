var createError = require('http-errors') // 错误页的处理
var express = require('express')
var path = require('path')
const fs = require('fs')
// var cookieParser = require('cookie-parser') // 解析 Cookie
const logger = require('morgan') // 实现日志功能
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
require('dotenv').config()

var indexRouter = require('./routes/index')
const blogRouter = require('./routes/blog')
const loginRouter = require('./routes/login')

var app = express()

// 定义模板引擎，因为在 web server 应用中用不到
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.json()) // 获取 post 的 JSON 数据，数据可通过 req.body 获取
app.use(express.urlencoded({ extended: false })) // 获取 post 中的数据，数据可通过 req.body 获取
// app.use(cookieParser()) // 解析 cookie

// 配置日志
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境
  app.use(logger('dev')) // 日志
} else {
  // 线上环境
  const logFileName = path.join(__dirname, './logs/access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }))
}

const redisClient = require('./db/redis')
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'sSQoDwr$%#_Wa',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}))

// 注册路由
app.use('/', indexRouter)
app.use('/blog', blogRouter)
app.use('/login', loginRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
