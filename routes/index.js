module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/posts')
        // res.send('hello')
    })
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/posts', require('./posts'))
}