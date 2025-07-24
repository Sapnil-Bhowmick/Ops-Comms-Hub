

const express = require("express")
const CommunicationRouter = express.Router()

const {
    listCommLogs,
    getSingleCommLog,
    createCommLog,
    updateCommLog,
    deleteCommLog,
    getCommLogsForEntity,
} = require("../Controllers/Communications.controller.js")

const {userAuth} = require("../Middleware/Auth.middleware.js")




CommunicationRouter.get("/", listCommLogs)
CommunicationRouter.get("/:CommID" , getSingleCommLog)
CommunicationRouter.post("/", userAuth , createCommLog)
CommunicationRouter.put("/:CommID", userAuth , updateCommLog)
CommunicationRouter.delete("/:CommID", userAuth , deleteCommLog)
CommunicationRouter.get("/:CommID/entity" , userAuth , getCommLogsForEntity )


module.exports = {
    CommunicationRouter
}