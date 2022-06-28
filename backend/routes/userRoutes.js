const express = require('express')

const app = express.Router()
const userController = require('../controllers/userController')

app.post('/register', userController().register)
app.post('/login', userController().login)


module.exports = app