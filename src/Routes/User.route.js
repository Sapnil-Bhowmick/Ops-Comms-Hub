
const express = require("express")
const UserRouter = express.Router()

const {
    handleRegister,
    handleLogin,
} = require("../Controllers/User.controller.js")

UserRouter.post("/login", handleLogin)
UserRouter.post("/register", handleRegister)



module.exports = {
    UserRouter
}