var mongoose = require('mongoose')

var Schema = mongoose.Schema

// Export model.
module.exports = new Schema({
    keyCode: { type: Number },
    name: { type: String },
    timeStamp: { type: String }
})