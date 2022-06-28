const User = require("../models/UserModel");
const UserModel = require("../models/UserModel");
const generateToken = require('../config/genrateToken')
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
                const userExist = await UserModel.findOne({ email })
                if (userExist) {
                    return res.status(401).json({
                        message: "Please enter another email."
                    })
                }
                const user = await UserModel.create(
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
                git commit -m "first commit"
            } catch (error) {
                res.json({ message: err })
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
                if (user && (await User.matchPasswords(password))) {
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
                res.json({ message: err })
            }
        }

    }
}


module.exports = userController