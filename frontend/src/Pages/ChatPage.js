import React, { useState, useEffect } from 'react';
import axios from 'axios'

const ChatPage = () => {
    const [chats, setChats] = useState([])
    const fetchChats = async () => {
        const data = await axios.get('/api/chat')
        setChats(data.data.data)
    }

    useEffect(() => {
        fetchChats()
    }, [])

    return (
        <div>
            {
                chats.map((x) => {
                    return <div key={x._id}>
                        {x.chatName}
                    </div>
                })
            }
        </div>
    )
}

export default ChatPage