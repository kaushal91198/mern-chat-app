// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

const mongoose = require('mongoose')


const ChatModel = mongoose.Schema({
    chatName: { type: String, trim: true },

    isGroupChat: { type: Boolean, default: true },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

}, { timeStamps: true })

module.exports = mongoose.model('Chat', ChatModel)