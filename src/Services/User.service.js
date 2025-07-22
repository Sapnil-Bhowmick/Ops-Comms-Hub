
const createHTTPError = require("http-errors")
const validator = require("validator")

const validate_UserRegistration = (req) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw createHTTPError.BadRequest("Name, email, and password are required.")
    }

    if (!validator.isEmail(email))  {
        throw createHTTPError.BadRequest('Invalid email format.')
    }

    if (password.length < 6) {
        throw createHTTPError.BadRequest('Password must be at least 6 characters long.')
    }
}


const validate_LoginCredentials = (req) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw createHTTPError.BadRequest("Please fill in the required fields")
    }

    if (!typeof(email) === "string" || !validator.isEmail(email)) {
        throw createHTTPError.BadRequest("Please ensure that the emailID is valid")
    }
}



module.exports = {
    validate_UserRegistration,
    validate_LoginCredentials
}