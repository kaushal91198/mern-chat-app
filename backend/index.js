const express = require('express')
require('dotenv').config()
const data = require('./data/data')
const app = express();
const port = process.env.PORT || 5000
const mongoConnection = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

const cors = require("cors");
mongoConnection();
app.use(express.json())
app.use(cors());

// app.get('/api/chat', async (req, res) => {
//     res.status(200).json({
//         data
//     })
// })
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


app.use((error, req, res, next) => {
    res.status(500).send('Could not perform the action');
})

// Capture 404 erors
app.use((req, res, next) => {
    res.status(404).send("PAGE NOT FOUND");
})
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

// require('socket.io') is function 
//we are calling that function
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
})
io.on('connection', (socket) => {
    console.log('connected to socket.io')
    socket.on('setup', (userData) => {
        // console.log(userData._id,'gsdfjbjbj')
        socket.join(userData._id)
        socket.emit('connection')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User Joined room', room)
    })

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat
        if (!chat.users) {
            return console.log('chat.users not defined.')
        }
        chat.users.forEach(user => {
            //we don't want emit event to sender
            if (user._id == newMessageReceived.sender._id) {
                return
            }
            socket.in(user._id).emit('message received', newMessageReceived)
            // console.log('dsgfjhkgfhj')
        })

    })

    socket.on('typing', (room) => {
        console.log(room,'typing')
        socket.in(room).emit('typing')
    })
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

})