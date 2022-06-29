import { Box } from '@chakra-ui/react';
import React from 'react';
import ChatBox from '../components/miscelleneous/ChatBox';
import MyChats from '../components/miscelleneous/MyChats';
import SideDrawer from '../components/miscelleneous/SideDrawer';
import { ChatState } from '../Context/chatProvider';

const ChatPage = () => {
    const { user } = ChatState()

    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent='space-between'
                w='100%'
                h='91.5vh'
            >
                {user && <MyChats />}
                {user && <ChatBox />}

            </Box>
        </div>
    )
}

export default ChatPage