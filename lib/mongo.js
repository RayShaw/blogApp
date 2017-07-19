const config = require('config-lite')
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)


module.exports.User = mongolass.model('User', {
    name: { type: 'sting' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enmu: ['m', 'f', 'x'] },
    bio: { type: 'string' }
})

// 根据用户名找到用户，用户名全局唯一
module.exports.User.index({ name: 1 }, { unique: true }).exec()
