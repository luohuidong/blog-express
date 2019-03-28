var express = require('express')
var router = express.Router()

const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { successModel, errorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

// 查询博客文章列表
router.get('/list', (req, res) => {
  const author = req.query.author || ''
  const keyword = req.query.keyword || ''

  getList(author, keyword).then(listData => {
    res.json(successModel(listData))
  }).catch(() => {
    res.json(errorModel('查询列表失败'))
  })
})

// 获取博客详情
router.get('/:blogId', (req, res) => {
  const { blogId } = req.params

  getDetail(blogId).then(detailData => {
    res.json(successModel(detailData))
  }).catch((error) => {
    console.error('error', error);
    res.json(errorModel('查询博客详情失败'))
  })
})

// 新建博客
router.post('/', loginCheck, (req, res) => {
  const blogData = {
    ...req.body,
    author: req.session.username
  }
  newBlog(blogData).then(data => {
    res.json(successModel(data))
  }).catch((error) => {
    console.error('error', error);
    res.json(errorModel('创建博客失败'))
  })
})

// 修改博客
router.put('/:blogId', loginCheck, (req, res) => {
  const { blogId } = req.params

  updateBlog(blogId, req.body).then(data => {
    res.json(successModel(data))
  }).catch((error) => {
    console.error('error', error);
    res.json(errorModel('更新博客失败'))
  })
})

// 删除博客
router.delete('/:blogId', loginCheck, (req, res) => {
  const { blogId } = req.params
  const author = req.session.username
  
  delBlog(blogId, author).then(result => {
    if (result) {
      res.json(successModel('删除博客成功'))
    } else {
      res.json(errorModel('删除博客失败'))
    }
  }).catch(error => {
    console.error('error', error);
    res.json(errorModel('删除博客失败'))
  })
})

module.exports = router
