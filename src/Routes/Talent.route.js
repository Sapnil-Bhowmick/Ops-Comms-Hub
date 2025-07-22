
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


TalentRouter.get("/", listTalents)
TalentRouter.get("/:talentID", getSingleTalent)
TalentRouter.post("/", userAuth , createTalent)
TalentRouter.put("/:talentID", userAuth , updateTalent)
TalentRouter.delete("/:talentID", userAuth , deleteTalent)
TalentRouter.patch("/:talentID/notes", userAuth , addNotes)
TalentRouter.patch("/:talentID/gigs", userAuth , LinkGigsToTalent)


module.exports = {
    TalentRouter
}