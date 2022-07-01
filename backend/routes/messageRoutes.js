const express = require('express')

const app = express.Router()
const messageController = require('../controllers/messageController')
const authMiddleware = require('../middleware/authMiddleware')

app.post('/', authMiddleware, messageController().sendMessage)
app.get('/:chatId', authMiddleware, messageController().allMessages)





module.exports = app