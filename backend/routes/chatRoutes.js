const express = require('express')

const app = express.Router()
const chatController = require('../controllers/chatController')
const authMiddleware = require('../middleware/authMiddleware')

app.post('/', authMiddleware, chatController().accessChat)
app.get('/', authMiddleware, chatController().fetchChats)
app.post('/group', authMiddleware, chatController().createGroupChat)
app.put('/rename', authMiddleware, chatController().renameGroup)
app.put('/groupadd', authMiddleware, chatController().addToGroup)
app.put('/groupremove', authMiddleware, chatController().removeFromGroup)





module.exports = app