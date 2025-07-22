const mongoose = require("mongoose")

const app = require("./app.js")
const Initialize_DB_Connection = require("./Config/database.js")


//* ENV variables
const { DATABASE_URL } = process.env
const port = process.env.PORT || 8000


//* Initialize Database Connection
let server
Initialize_DB_Connection(DATABASE_URL)
    .then(() => {
        console.log("Database Connection Eshtablished Successfully")
        server = app.listen(port, () => {
            console.log(`Server listening on ${port}...`)
        })
    })
    .catch((err) => {
        console.error(`Failed to Eshtablish database Connection : ${err.message}`)
        exitHandler()
    })





//* Set Mongoose Debugging mode in Development
if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true)
}


// !----------------- Handling Unhandled Errors -----------------

const exitHandler = () => {
    if (server) {
        console.log("Server Closed")
        process.exit(1)
    } else {
        process.exit(1)
    }
}


const unexpectedErrorHandler = (error) => {
    console.log(error)
    exitHandler()
}

process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)

process.on("SIGTERM", unexpectedErrorHandler)