const express = require('express')

const app = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

app.post('/register', userController().register)
app.post('/login', userController().login)
app.get('/', authMiddleware, userController().searchUser)



module.exports = app