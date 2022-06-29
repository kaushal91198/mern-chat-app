import { Tooltip, Box, Button, Text, Menu, MenuButton, MenuList, Avatar, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon, BellIcon } from '@chakra-ui/icons'

import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';

const SideDrawer = () => {
    const { user } = ChatState()
    const [search, setsearch] = useState()
    const [searchResult, setSearchResult] = useState()
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()


    return (
        <>
            <Box
                display="flex"
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                w='100%'
                p='5px 10px 5px 10px'
                borderWidth='5px'
            >
                <Tooltip label='Search users to chat' hasArrow placeholder='bottom-end'>
                    <Button variant='ghost'>
                        <i className='fas fa-search'></i>
                        <Text d={{ base: 'none', md: "flex" }} px='4'>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='Work-sans'>
                    Talk-A-Tive
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
                        {/* <MenuList p={1}>
                    </MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>
                                My Profile
                            </MenuItem>
                            <MenuItem>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

        </>
    )
}

export default SideDrawer