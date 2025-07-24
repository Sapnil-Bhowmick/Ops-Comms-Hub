
const express = require("express")
const router = express.Router()


const {UserRouter} = require("./User.route.js")
const {ClientRouter} = require("./Client.route.js")
const {TalentRouter} = require("./Talent.route.js")
const {GigRouter} = require("./Gig.route.js")
const { CommunicationRouter } = require("./Communication.route.js")


router.use("/auth" , UserRouter)
router.use("/clients" , ClientRouter)
router.use("/talents" , TalentRouter)
router.use("/gigs" , GigRouter)
router.use("/logs" , CommunicationRouter)

module.exports = router