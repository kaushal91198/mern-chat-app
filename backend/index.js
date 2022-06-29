const express = require('express')
require('dotenv').config()
const data = require('./data/data')
const app = express();
const port = process.env.PORT || 5000
const mongoConnection = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
mongoConnection();
app.use(express.json())

app.get('/api/chat', async (req, res) => {
    res.status(200).json({
        data
    })
})
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

app.use((error, req, res, next) => {
    res.status(500).send('Could not perform the action');
})

// Capture 404 erors
app.use((req, res, next) => {
    res.status(404).send("PAGE NOT FOUND");
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})