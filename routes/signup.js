const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
    // res.send(req.flash())
    res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
    // res.send(req.flash())
     res.render('signup')
})

module.exports = router