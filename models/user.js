var mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserSchema = new Schema({
    name: { type: String },
    age: { type: Number },
    email: { type: String },
    password: { type: String },
    genre: { type: String },
    handedness: { type: String },
    handDesease: { type: String },
    userAgent: { type: String }
})

// Export model.
module.exports = mongoose.model('User', UserSchema)