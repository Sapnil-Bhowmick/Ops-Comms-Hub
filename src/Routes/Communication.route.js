

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
const { checkRole } = require("../Middleware/Role.middleware.js")



CommunicationRouter.get("/", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), listCommLogs);
CommunicationRouter.get("/:CommID", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "TALENT", "CLIENT"), getSingleCommLog);

CommunicationRouter.post("/", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "TALENT"), createCommLog);
CommunicationRouter.put("/:CommID", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), updateCommLog);
CommunicationRouter.delete("/:CommID", userAuth, checkRole("ADMIN"), deleteCommLog);

CommunicationRouter.get("/:CommID/entity", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "TALENT", "CLIENT"), getCommLogsForEntity);


module.exports = {
    CommunicationRouter
}