
const express = require("express")
const GigRouter = express.Router()

const {
    listGigs,
    getSingleGig,
    createGig,
    updateGig,
    deleteGig,
    addGigUpdates,
    addGigDeliverables,
    addTalent,
    deleteTalent
} = require("../Controllers/Gig.controller.js")

const {userAuth} = require("../Middleware/Auth.middleware.js")
const { checkRole } = require("../Middleware/Role.middleware.js")





GigRouter.get("/", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "CLIENT"), listGigs);
GigRouter.get("/:GigID", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "CLIENT", "TALENT"), getSingleGig);

GigRouter.post("/", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), createGig);
GigRouter.put("/:GigID", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), updateGig);
GigRouter.delete("/:GigID", userAuth, checkRole("ADMIN"), deleteGig);

GigRouter.patch("/:GigID/updates", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "TALENT"), addGigUpdates);
GigRouter.patch("/:GigID/deliverables", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "TALENT"), addGigDeliverables);

GigRouter.patch("/:GigID/talent" , userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), addTalent)
GigRouter.delete("/:GigID/talent" , userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), deleteTalent)


module.exports = {
    GigRouter
}