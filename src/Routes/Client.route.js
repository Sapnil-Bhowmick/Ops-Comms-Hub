
const express = require("express")
const ClientRouter = express.Router()

const {
    listClients,
    getSingleClient,
    createClient,
    updateClient,
    deleteClient,
    addNotesToClient,
    LinkGigsToClient
}  = require("../Controllers/Client.controller.js")

const { userAuth } = require("../Middleware/Auth.middleware.js")
const { checkRole } = require("../Middleware/Role.middleware.js")




ClientRouter.get("/", userAuth , checkRole("ADMIN" , "PROJECT_MANAGER") , listClients)
ClientRouter.get("/:clientID", userAuth , checkRole("ADMIN" , "PROJECT_MANAGER" , "CLIENT") , getSingleClient)
ClientRouter.post("/", userAuth , checkRole("ADMIN") , createClient)
ClientRouter.patch("/:clientID", userAuth , checkRole("ADMIN" , "PROJECT_MANAGER") , updateClient)
ClientRouter.delete("/:clientID", userAuth , checkRole("ADMIN") , deleteClient)
ClientRouter.patch("/:clientID/notes", userAuth , checkRole("ADMIN" , "PROJECT_MANAGER") , addNotesToClient)
ClientRouter.patch("/:clientID/gigs", userAuth , checkRole("ADMIN" , "PROJECT_MANAGER") , LinkGigsToClient)


module.exports = {
    ClientRouter
}