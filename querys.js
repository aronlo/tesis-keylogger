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
            console.log(record)
            console.log(new_vals);
            return new_vals.length
        };
        Record.mapReduce(o, function (err, results) {
            resolve(results)
        })
    })
}

function getUserImpostorRecordsCountJs() {
    return new Promise(async resolve => {
        var results = []
        var records = await Record.find()
        records.forEach(e1 => {
            if (e1.belongedUserId.toString() != e1.performedUserId.toString()) {
                if (results.findIndex(e2 => e2._id.toString() == e1.belongedUserId.toString()) == -1) {
                    results.push({ _id: e1.belongedUserId, value: 0 })
                }
                var idx = results.findIndex(e3 => e3._id.toString() == e1.belongedUserId.toString())
                results[idx].value = results[idx].value + 1
            }
        })
        var data = { results: results }
        resolve(data)
    })
}


exports.getUserImpostorRecordsCount = getUserImpostorRecordsCount
exports.getUserImpostorRecordsCountJs = getUserImpostorRecordsCountJs
exports.getUserIds = getUserIds