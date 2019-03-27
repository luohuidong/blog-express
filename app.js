var createError = require('http-errors'); // 错误页的处理
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // 解析 Cookie
var logger = require('morgan'); // 实现日志功能

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog')

var app = express();

// 定义模板引擎，因为在 web server 应用中用不到
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); // 日志
app.use(express.json()); // 获取 post 的 JSON 数据，数据可通过 req.body 获取
app.use(express.urlencoded({ extended: false })); // 获取 post 中的数据，数据可通过 req.body 获取
app.use(cookieParser()); // 解析 cookie
app.use(express.static(path.join(__dirname, 'public'))); // 提供静态文件， web server 应用中不会用到

// 注册路由
app.use('/', indexRouter);
app.use('/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
