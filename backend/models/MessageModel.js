const mongoose = require('mongoose')


const MessageModel = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId,  ref: "User" },

    content: { type: String, trim: true },

    chat:  {type: mongoose.Schema.Types.ObjectId,  ref: "Chat" },

    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

}, { timeStamps: true })

module.exports = mongoose.model('Message', MessageModel)