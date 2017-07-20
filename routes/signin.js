const express = require('express')
const router = express.Router()
const sha1 = require("sha1")
const UserModel = require("../models/users")

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    // res.send(req.flash())
    res.render("signin")
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    // res.send(req.flash())
    let name = req.fields.name
    let password = req.fields.password

    UserModel.getUserByName(name)
        .then(function (user) {
            if (!user) {
                req.flash("error", "用户不存在")
                return res.redirect("back")
            }
            // 检查密码
            if (sha1(password) !== user.password) {
                req.flash("error", "用户名或者密码错误")
                return res.redirect("back")
            }

            req.flash("success", "登陆成功")
            // 用户信息写入session
            delete user.password
            req.session.user = user
            // 跳转到主页
            res.redirect("/posts")
        })
        .catch(next)
})

module.exports = router