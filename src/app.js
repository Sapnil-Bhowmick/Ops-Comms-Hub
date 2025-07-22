require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const mongoSanitize = require('express-mongo-sanitize');
const cors = require("cors")
const createHTTPError = require("http-errors")

const router = require("./Routes/index.js")



//& Create Express Server
const app = express()



// ------------------------------------------ MIDDLEWARES ------------------------------------------



//& CORS
app.use("/", cors())

//& Helmet
app.use("/", helmet())

//& Mongo Sanitize
app.use("/", mongoSanitize())

//& Morgan (for development only)
if (process.env.NODE_ENV !== "production") {
    app.use("/", morgan("dev"))
}


//& Parse JSON payloads
app.use(express.json())




// * Applying Version-1 Routes 
app.use("/api/V1", router)



//! ----------------- Handling HTTP errors -----------------

app.use("/", (req, res, next) => {
    throw createHTTPError.NotFound("This route does not exist")
})


app.use("/", (err, req, res, next) => {
    console.log("ERRIR -> ", err)
    res.status(err.status || 500)
    return res.json({
        error: {
            status: err.status || 500,
            message: err.message,
            ...(err.invalidIds && { invalidIds: err.invalidIds })
        }
    })
})

module.exports = app