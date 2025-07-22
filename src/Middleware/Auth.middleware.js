const createHTTPError = require("http-errors")

const { verify_JWT_Token } = require("../Services/token.service.js")
const User = require("../Models/User.model.js")



const userAuth = async (req, res, next) => {
    // console.log("In auth middleware")
    try {
        const bearerToken = req.headers["authorization"]
        if (!bearerToken) {
            throw createHTTPError.Unauthorized("You are Unauthorized")
        }

        const token = bearerToken.split(" ")[1]
        const decodedPayload = await verify_JWT_Token(token, process.env.JWT_TOKEN_SECRET)
        // console.log("token" , token)
        
        if (!decodedPayload) {
            throw createHTTPError.Unauthorized("Invalid Token")
        }

        const { userID, role } = decodedPayload

        // * Check that the admin / member exists
        let existing_user = await User.findById(userID)

        if(existing_user){
            req.LoggedIn_UserInfo = decodedPayload 
        } else {
            createHTTPError.NotFound("User Not Found")
        }

        next()
    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    userAuth
}