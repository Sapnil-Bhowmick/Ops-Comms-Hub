
const {
    signJWT,
    verifyJWT
} = require("../Utils/token.util.js")

const generate_JWT_Token = async(tokenPayload , expiryTime , tokenSecret) => {
    const token = await signJWT(tokenPayload , expiryTime , tokenSecret)
    return token
}

const verify_JWT_Token = async(token , tokenSecret) => {
    const decodedPayload = await verifyJWT(token , tokenSecret)
    return decodedPayload
}


module.exports = {
    generate_JWT_Token,
    verify_JWT_Token
}