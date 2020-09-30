var mongoose = require('mongoose')
var KeystrokeSchema = require('./keystroke')

var Schema = mongoose.Schema

var RecordSchema = new Schema({
    belongedUserId: { type: Schema.Types.ObjectId },
    performedUserId: { type: Schema.Types.ObjectId },
    date: { type: Date, default: Date.now },
    sessionIndex: { type: Number },
    valid: { type: Boolean },

    username: { type: String },
    password: { type: String },
    rawUsernameKeydown: { type: [KeystrokeSchema] },
    rawUsernameKeyup: { type: [KeystrokeSchema] },
    rawPasswordKeydown: { type: [KeystrokeSchema] },
    rawPasswordKeyup: { type: [KeystrokeSchema] },

    ipAddress: { type: String },
    userAgent: { type: String },
    token: { type: String }
})

// Export model.
module.exports = mongoose.model('Record', RecordSchema)