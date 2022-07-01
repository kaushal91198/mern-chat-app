const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

function chatController() {
    return {
        accessChat: async (req, res) => {
            try {
                const { userId } = req.body;
                if (!userId) {
                    console.log();
                    return res.status(401);
                }
                let isChat = await ChatModel.find({
                    isGroupChat: false,
                    $and: [
                        { users: { $elemMatch: { $eq: req.user._id } } },
                        { users: { $elemMatch: { $eq: userId } } },
                    ],
                })
                    .populate("users", "-password")
                    .populate("latestMessage");
                isChat = await UserModel.populate(isChat, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                if (isChat.length > 0) {
                    res.send(isChat[0]);
                } else {
                    let chatData = {
                        chatName: "sender",
                        isGroupChat: false,
                        users: [req.user._id, userId],
                    };
                    try {
                        const createdChat = await ChatModel.create(chatData);
                        const fullChat = await ChatModel.findOne({
                            _id: createdChat._id,
                        }).populate("users", "-password");
                        res.status(200).send(fullChat);
                    } catch (error) {
                        res.status(500).json({ message: error });
                    }
                }
            } catch (error) {
                res.status(500).json({ message: err });
            }
        },
        fetchChats: async (req, res) => {
            try {
                let chat = await ChatModel.find({
                    users: { $elemMatch: { $eq: req.user._id } },
                })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    .populate("latestMessage")
                    .sort({ updated: -1 });

                chat = await UserModel.populate(chat, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                // console.log(chat)
                res.status(200).json(chat);
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: error });
            }
        },
        createGroupChat: async (req, res) => {
            try {
                if (!req.body.users || !req.body.name) {
                    return res.status(409).json({ message: "Please fill all the fields" });
                }
                let users = JSON.parse(req.body.users);
                if (users.length < 2) {
                    return res.status(400).json({
                        message: "More than 2 users are required to form a group chat. ",
                    });
                }
                users.push(req.user);
                console.log(users, 'users')
                const groupChat = await ChatModel.create({
                    chatName: req.body.name,
                    users: users,
                    isGroupChat: true,
                    groupAdmin: req.user,
                });
                const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                res.status(200).json(fullGroupChat);
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: error });
            }
        },
        renameGroup: async (req, res) => {
            try {
                const { chatId, chatName } = req.body;
                if (!chatId || !chatName) {
                    return res.status.json({ message: "Please fill all the fields" });
                }
                const updatedChat = await ChatModel.findByIdAndUpdate(
                    chatId,
                    { chatName: chatName },
                    { new: true }
                )
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                if (!updatedChat) {
                    return res.status(401).json({
                        message: "Chat name is not updated.",
                    });
                }
                res.status(200).json(updatedChat);
            } catch (error) {
                res.status(500).json({ message: error });
            }
        },
        addToGroup: async (req, res) => {
            try {
                const { chatId, userId } = req.body;
                if (!chatId || !userId) {
                    return res.status.json({ message: "Please fill all the fields" });
                }
                const addToGroup = await ChatModel.findByIdAndUpdate(
                    chatId,
                    {
                        $push: { users: userId },
                    },
                    {
                        new: true,
                    }
                )
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                if (!addToGroup) {
                    return res.status(401).json({
                        message: "Chat not found.",
                    });
                }
                res.status(200).json(addToGroup);
            } catch (error) {
                res.status(500).json({ message: error });
            }
        },
        removeFromGroup: async (req, res) => {
            try {
                const { chatId, userId } = req.body;
                if (!chatId || !userId) {
                    return res.status.json({ message: "Please fill all the fields" });
                }
                const removeFromGroup = await ChatModel.findByIdAndUpdate(
                    chatId,
                    {
                        $pull: { users: userId },
                    },
                    {
                        new: true,
                    }
                )
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
                if (!removeFromGroup) {
                    return res.status(401).json({
                        message: "Chat not found.",
                    });
                }
                res.status(200).json(removeFromGroup);
            } catch (error) {
                console.llog(error)
                res.status(500).json({ message: error });
            }
        },
    };
}

module.exports = chatController;
