const config = require("config-lite")(__dirname)
const Mongolass = require("mongolass")
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

const moment = require("moment")
const objectIdToTimestamp = require('objectid-to-timestamp')

// 根据id生成创建时间 create_at
mongolass.plugin("addCreateAt", {
    afterFind: function (results) {
        results.forEach(function (element) {
            element.create_at = moment(objectIdToTimestamp(element._id)).format("YYYY-MM-DD HH:mm")
        })
        return results
    },
    afterFindOne: function (result) {
        if (result) {
            result.create_at = moment(objectIdToTimestamp(result._id)).format("YYYY-MM-DD HH:mm")
        }
        return result
    }
})

exports.User = mongolass.model("User", {
    name: { type: "string" },
    password: { type: "string" },
    avatar: { type: "string" },
    gender: { type: "string", enum: ["m", "f", "x"] },
    bio: { type: "string" }
})
// 根据用户名找到用户，用户名全局唯一
exports.User.index({ name: 1 }, { unique: true }).exec()

exports.Post = mongolass.model("Post", {
    author: { type: Mongolass.Types.ObjectId },
    title: { type: "string" },
    content: { type: "string" },
    pv: { type: "number" },
})
// 按创建时间降序查看用户的文章列表
exports.Post.index({ author: 1, _id: -1 }).exec()

exports.Comment = mongolass.model("Comment", {
    author: { type: Mongolass.Types.ObjectId },
    content: { type: "string" },
    postId: { type: Mongolass.Types.ObjectId }
})
// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ postId: 1, _id: 1 }).exec()
// 通过用户 id 和留言 id 删除一个留言
exports.Comment.index({ author: 1, _id: 1 })