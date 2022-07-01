const User = require("../models/UserModel");
const generateToken = require('../config/genrateToken')
const url = require("url");
require('dotenv').config()


function userController() {
    return {
        register: async (req, res) => {
            try {
                const { name, email, password, pic } = req.body
                if (!name || !email || !password) {
                    return res.status(500).json({
                        message: "Please enter all the fields."
                    })
                }
                const userExist = await User.findOne({ email })
                if (userExist) {
                    return res.status(401).json({
                        message: "Please enter another email."
                    })
                }
                const user = await User.create(
                    {
                        name,
                        email,
                        password,
                        pic
                    }
                )
                if (user) {
                    return res.status(200).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        pic: user.pic,
                        token: generateToken(user._id)
                    })
                }
                else {
                    return res.status(500).json({
                        message: "Failed to create user."
                    })
                }
            } catch (error) {
                res.status(500).json({ message: error })
            }
        },
        login: async (req, res) => {
            try {
                const { email, password } = req.body
                if (!email || !password) {
                    return res.status(500).json({
                        message: "Please enter all the fields."
                    })
                }
                const user = await User.findOne({
                    email
                })
                // console.log(user)
                // if (user && (await User.matchPasswords(password))) {
                    if (user && (await user.matchPassword(password))) {

                    // console.log('fgdnjmnmn')
                    return res.status(200).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        pic: user.pic,
                        token: generateToken(user._id)
                    })
                }
                else {
                    return res.status(401).json({
                        message: "Incorrect email or password"
                    })
                }



            } catch (error) {
                res.status(500).json({ message: error })
            }
        },
        searchUser: async (req, res) => {
            try {
                const parsedUrl = url.parse(req.url, true);
                if (!parsedUrl.query.search) {
                    return res.status(409).json({
                        message: "Please enter the user name.",
                        success: false,
                    });
                }
                //$options -> Case insensitivity to match upper and lower cases
                const keyword = {
                    $or: [
                        { name: { $regex: req.query.search, $options: 'i' } },
                        { email: { $regex: req.query.search, $options: 'i' } },

                    ]
                }
                const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
                res.status(200).json(users)
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: error })
            }
        }

    }
}


module.exports = userController