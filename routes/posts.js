const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

const PostModel = require("../models/posts")

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
    // res.send(req.flash())
    // res.render('posts')
    let author = req.query.author

    PostModel.getPosts(author)
        .then(function (posts) {
            // console.log("posts", posts)
            res.render("posts", {
                posts: posts
            })
        })
        .catch(next)
})

// POST /posts 发表一篇文章
router.post('/', checkLogin, function (req, res, next) {
    // res.send(req.flash())
    let author = req.session.user._id
    let title = req.fields.title
    let content = req.fields.content

    // 校验参数
    try {
        if (!title.length) {
            throw new Error("请填写标题")
        }
        if (!content.length) {
            throw new Error("请填写内容")
        }
    } catch (e) {
        req.flash("error", e.message)
        return res.redirect("back")
    }

    let post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    }

    PostModel.create(post)
        .then(function (result) {
            // 此post是插入mongodb后的值， 包含_id
            post = result.ops[0]
            req.flash("success", "发表成功")
            // 发表成功后跳转到该文章页
            res.redirect(`/posts/${post._id}`)
        })
        .catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
    // res.send(req.flash())
    res.render("create")
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
    // res.send(req.flash())
    let postId = req.params.postId

    Promise.all([
        PostModel.getPostById(postId), // 获取文章信息
        PostModel.incPv(postId) // pv 加1

    ]).then(function (result) {
        let post = result[0]
        if (!post) {
            throw new Error("该文章不存在")
        }

        res.render("post", {
            post: post
        })
    }).catch(next)

})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    // res.send(req.flash())
    let postId = req.params.postId
    let author = req.session.user._id


    PostModel.getRawPostById(postId)
        .then(function (post) {
            if (!post) {
                throw new Error("该文章不存在")
            }

            if (author.toString() !== post.author._id.toString()) {
                throw new Error("权限不足")
            }
            res.render("edit", {
                post: post
            })
        })
        .catch(next)

})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    // res.send(req.flash())
    let postId = req.params.postId
    let author = req.session.user._id
    let title = req.fields.title
    let content = req.fields.content

    PostModel.updatePostById(postId, author, { title: title, content: content })
        .then(function () {
            req.flash("success", "编辑文章成功")
            // 编辑成功后挑战到上一页
            res.redirect(`/posts/${postId}`)
        })
        .catch(next)
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    // res.send(req.flash())
    let postId = req.params.postId
    let author = req.session.user._id

    PostModel.delPostById(postId, author)
        .then(function () {
            req.flash("success", "删除文章成功")
            // 删除成功后跳转到主页
            res.redirect("/posts")
        })
        .catch(next)
})

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
    res.send(req.flash())
})

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function (req, res, next) {
    res.send(req.flash())
})

module.exports = router
