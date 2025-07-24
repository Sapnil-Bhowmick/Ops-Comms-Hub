
const express = require("express")
const GigRouter = express.Router()

const {
    listGigs,
    getSingleGig,
    createGig,
    updateGig,
    deleteGig,
    addGigUpdates,
    addGigDeliverables
} = require("../Controllers/Gig.controller.js")

const {userAuth} = require("../Middleware/Auth.middleware.js")

GigRouter.get("/", listGigs)
GigRouter.get("/:GigID" , getSingleGig)
GigRouter.post("/", userAuth , createGig)
GigRouter.put("/:GigID", userAuth , updateGig)
GigRouter.delete("/:GigID", userAuth , deleteGig)
GigRouter.patch("/:GigID/updates" , userAuth , addGigUpdates)
GigRouter.patch("/:GigID/deliverables" , userAuth , addGigDeliverables)


module.exports = {
    GigRouter
}