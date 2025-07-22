
const jwt = require("jsonwebtoken")

const signJWT = (tokenPayload , expiryTime , tokenSecret) => {
    return new Promise((resolve , reject) => {
        jwt.sign(tokenPayload , tokenSecret , {expiresIn: expiryTime} , (err , token) => {
            if(err){
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}

const verifyJWT = (token , tokenSecret) => {
    return new Promise((resolve , reject) => {
        jwt.verify(token , tokenSecret , (err , decodedPayload) => {
            if(err){
                resolve(null)
            } else {
                resolve(decodedPayload)
            }
        })
    })
}



module.exports = {
    signJWT,
    verifyJWT
}