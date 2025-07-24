const createHTTPError = require("http-errors")

const User = require("../Models/User.model.js")

const { validate_UserRegistration, validate_LoginCredentials } = require("../Services/User.service")
const bcrypt = require("bcrypt")
const { generate_JWT_Token } = require("../Services/token.service.js")


const handleRegister = async (req, res, next) => {
    console.log("registering....")
    try {
        validate_UserRegistration(req)

        const { name, email, password, role } = req.body;

        // Validate role if provided
        const allowedRoles = ['ADMIN', 'PROJECT_MANAGER', 'TALENT', 'CLIENT'];
        if (!allowedRoles.includes(role)) {
            throw createHTTPError.BadRequest("Invalid Role Type")
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createHTTPError.Conflict("Email is already registered.")
        }

        // Create user
        const newUser = new User({
            name,
            email,
            password,
            role
        });

        // Hash password
        const hashedPassword = await newUser.hashPassword(password);

        newUser.password = hashedPassword

        await newUser.save()

        delete newUser.password

        return res.json({
            message: `${role} created successfully`,
            data: newUser
        })


    }
    catch (err) {
        next(err)
    }
}



const handleLogin = async (req, res, next) => {
    try {
        validate_LoginCredentials(req)

        const { email , password } = req.body
        let existing_Admin_Member, role, isMember

        existing_Member = await User.findOne({ email: email.toLowerCase() })

        if (!existing_Member) {
            throw createHTTPError.NotFound("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, existing_Member.password)
        if (!isPasswordValid) {
            throw createHTTPError.NotFound("Invalid Credentials")
        } else {
            const tokenPayload = {
                userID: existing_Member._id,
                role: existing_Member.role
            }
            const token = await generate_JWT_Token(tokenPayload, "1d", process.env.JWT_TOKEN_SECRET)

            // * Remove Password
            existing_Member = existing_Member.toObject()
            delete existing_Member.password

            return res.json({
                message: "Login Successfull",
                data: {
                    token,
                    user: existing_Member
                }
            })
        }
    }
    catch (err) {
        next(err)
    }
}






module.exports = {
    handleRegister,
    handleLogin,
}