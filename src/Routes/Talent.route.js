
const express = require("express")
const TalentRouter = express.Router()

const {
    listTalents,
    getSingleTalent,
    createTalent,
    updateTalent,
    deleteTalent,
    addNotes,
    LinkGigsToTalent
} = require("../Controllers/Talent.controller.js")

const { userAuth } = require("../Middleware/Auth.middleware.js")
const { checkRole } = require("../Middleware/Role.middleware.js")


TalentRouter.get("/", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), listTalents);
TalentRouter.get("/:talentID", userAuth, checkRole("ADMIN", "PROJECT_MANAGER", "TALENT"), getSingleTalent);
TalentRouter.post("/", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), createTalent);
TalentRouter.put("/:talentID", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), updateTalent);
TalentRouter.delete("/:talentID", userAuth, checkRole("ADMIN"), deleteTalent);
TalentRouter.patch("/:talentID/notes", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), addNotes);
TalentRouter.patch("/:talentID/gigs", userAuth, checkRole("ADMIN", "PROJECT_MANAGER"), LinkGigsToTalent);


module.exports = {
    TalentRouter
}