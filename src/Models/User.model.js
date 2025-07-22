// models/User.js
const mongoose = require('mongoose');
const validator = require("validator")

const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"]
    },
    email: {
        type: String,
        required: [true , "Please provide email"],
        lowercase: true,
        validate: {
            validator: function (email) {
                if (!validator.isEmail(email)) {
                    throw createHTTPError.Conflict("Please provide a valid email address")
                }
            }
        } ,
        unique: true    
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minLength: [6, "Password should be atleast of 6 characters"],
    },
    role: {
        type: String,  
        enum: ['ADMIN', 'PROJECT_MANAGER', 'TALENT', 'VIEWER'],
        default: 'viewer',
        required: ["Please add a role"]
    },
    createdAt: { type: Date, default: Date.now }
});





userSchema.methods.hashPassword = async function (password) {
    const saltRounds = 15
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

module.exports = mongoose.model('User', userSchema);  
