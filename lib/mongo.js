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
