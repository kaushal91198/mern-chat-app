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
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User Joined room', room)
    })

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat
        if (!chat.users) {
            return console.log('chat.users not defined.')
        }
        // console.log(newMessageReceived.chat._id, "message receiev")
        // socket.to().emit('message received', newMessageReceived)
        chat.users.forEach(user => {
            // we don't want emit event to sender
            if (user._id == newMessageReceived.sender._id) {
                return
            }
            // this function emit the events everyone in the room
            socket.in(user._id).emit('message received', newMessageReceived)
            //this function  emit the events everyone except sender
            // socket.to(user._id).emit('message received', newMessageReceived)
            // console.log('dsgfjhkgfhj')
        })
        console.log(socket.rooms)

    })

    socket.on('typing', (room) => {
        console.log(room, 'typing')
        socket.in(room).emit('typing')
    })
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

})