
const express = require("express")
const GigRouter = express.Router()

const {
    listGigs,
    getSingleGig,
    createGig,
    updateGig,
    deleteGig
} = require("../Controllers/Gig.controller.js")

const {userAuth} = require("../Middleware/Auth.middleware.js")

GigRouter.get("/", listGigs)
GigRouter.get("/:GigID" , getSingleGig)
GigRouter.post("/", userAuth , createGig)
GigRouter.put("/:gigID", userAuth , updateGig)
GigRouter.delete("/:gigID", userAuth , deleteGig)


module.exports = {
    GigRouter
}