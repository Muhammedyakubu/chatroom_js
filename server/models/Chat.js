const mongoose = require('mongoose')
const User = require('./User');

const chatSchema = new mongoose.Schema({
    content: String,
    sentBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    timeSent: Date,
})


module.exports = mongoose.model("User", userSchema)