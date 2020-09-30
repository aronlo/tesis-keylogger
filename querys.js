const User = require('./models/user');
const Record = require('./models/record');

function getUserIds() {
    return new Promise(resolve => {
        User.find()
            .select({ _id: 1 })
            .exec((err, userDocs) => {
                resolve(userDocs)
            })
    })
}

function getUserImpostorRecordsCount() {
    return new Promise(resolve => {
        const o = {};
        o.map = function () { emit(this.belongedUserId, { belongedUserId: this.belongedUserId, performedUserId: this.performedUserId }) };
        o.reduce = function (k, vals) {
            var new_vals = vals.filter(function (record) {
                return record.belongedUserId.toString() != record.performedUserId.toString()
            })
            return new_vals.length
        };
        Record.mapReduce(o, function (err, results) {
            return resolve(results)
        })
    })

}

exports.getUserImpostorRecordsCount = getUserImpostorRecordsCount
exports.getUserIds = getUserIds