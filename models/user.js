var mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserSchema = new Schema({
    name: { type: String },
    lastname: { type: String },
    age: { type: Number },
    email: { type: String },
    username: { type: String },
    password: { type: String },
    isImposedPassword: { type: Boolean },
    genre: { type: String },
    handedness: { type: String },
    handDesease: { type: String },
    date: { type: Date, default: Date.now },

    ipAddress: { type: String },
    userAgent: { type: String }
})

// Export model.
module.exports = mongoose.model('User', UserSchema)