
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



ClientRouter.get("/", listClients)
ClientRouter.get("/:clientID", getSingleClient)
ClientRouter.post("/", userAuth , createClient)
ClientRouter.patch("/:clientID", userAuth , updateClient)
ClientRouter.delete("/:clientID", userAuth , deleteClient)
ClientRouter.patch("/:clientID/notes", userAuth , addNotesToClient)
ClientRouter.patch("/:clientID/gigs", userAuth , LinkGigsToClient)


module.exports = {
    ClientRouter
}