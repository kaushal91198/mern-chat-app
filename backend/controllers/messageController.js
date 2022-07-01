const MessageModel = require("../models/MessageModel");
const generateToken = require('../config/genrateToken')
const url = require("url");
const UserModel = require("../models/UserModel");
const ChatModel = require("../models/ChatModel");
require('dotenv').config()


function messageController() {
    return {
        sendMessage: async (req, res) => {
            try {
                const { content, chatId } = req.body
                if (!content || !chatId) {
                    return res.status(500).json({
                        message: "Please enter all the fields."
                    })

                }
                let newMessage = {
                    sender: req.user._id,
                    content,
                    chat: chatId
                }
                try {
                    let message = await MessageModel.create(newMessage)
                    message = await message.populate('sender', 'name pic')
                    message = await message.populate('chat')
                    message = await UserModel.populate(message, { path: 'chat.users', select: 'name pic email' })
                    await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message })
                    res.status(200).json(message)
                } catch (error) {
                    res.status(500).json({ message: error });
                }
            } catch (error) {
                res.status(500).json({ message: error })
            }
        },
        allMessages: async (req, res) => {
            try {
                // console.log(req.params.chatId)
                const messages = await MessageModel.find({ chat: req.params.chatId })
                    .populate('sender', 'name pic email')
                    .populate('chat')

                res.status(200).json(messages)
            } catch (error) {
                res.status(500).json({ message: error })
            }
        },
    }
}


module.exports = messageController