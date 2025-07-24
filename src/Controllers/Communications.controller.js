
const mongoose = require('mongoose');
const createHttpError = require("http-errors");

const Client = require("../Models/Client.model.js")
const Talent = require("../Models/Talent.model.js")
const Gig = require("../Models/Gig.model.js")

const CommLog = require("../Models/Communations.model.js")


const { validate_CommLogCreatePayload } = require('../Services/Communication.service');


const listCommLogs = async (req, res, next) => {
    try {
        const logs = await CommLog.find()
        res.json({
            message: "logs Fetched Successfully",
            data: logs
        })
    }
    catch (err) {
        next(Error)
    }
}



const getSingleCommLog = async (req, res, next) => {
    console.log("----------- > " , req.params.CommID)
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.CommID)) {
            throw createHttpError.BadRequest("Invalid CommID");
        }

        const log = await CommLog.findById(req.params.CommID)

        if(!log) throw createHttpError.NotFound("CommLog Not Found")

        res.json({
            message: "CommLog Fetchd Successfully",
            data: log
        })

    }
    catch (err) {
        next(Error)
    }
}


const createCommLog = async (req, res, next) => {
    try {
        const data = req.body;

        validate_CommLogCreatePayload(data)

        if (!mongoose.Types.ObjectId.isValid(req.body.linkedTo)) {
            throw createHttpError.BadRequest("Invalid linkedTo ID");
        }

        if (req.body.linkedToModel === "Client") {
            const existingClient = await Client.findById(req.body.linkedTo)
            if (!existingClient) throw createHttpError.NotFound("Client Not Found")
        } else if (req.body.linkedToModel === "Talent") {
            const existingTalent = await Talent.findById(req.body.linkedTo)
            if (!existingTalent) throw createHttpError.NotFound("Talent Not Found")
        } else {
            const existingGig = await Gig.findById(req.body.linkedTo)
            if (!existingGig) throw createHttpError.NotFound("Gig Not Found")
        }

        const { userID, role } = req.LoggedIn_UserInfo

        const comm = await CommLog.create({
            ...data,
            createdBy: userID
        });

        res.json({
            mesage: "CommLog Created Successfully",
            data: comm
        });

    } catch (err) {
        next(err);
    }

}


const updateCommLog = async (req, res, next) => {
    try {
        const { CommID } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(CommID)) {
            throw createHttpError.BadRequest("Invalid CommID");
        }

        const updated = await CommLog.findByIdAndUpdate(
            CommID,
            { $set: { ...req.body, updatedAt: Date.now() } },
            { new: true, runValidators: true });

        if (!updated) throw createHttpError.NotFound("CommLog not found");

        res.json({
            message: "CommLog Updated",
            data: updated
        });
    } catch (err) {
        next(err);
    }
}


const deleteCommLog = async (req, res, next) => {
    try {
        const { CommID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(CommID)) {
            throw createHttpError.BadRequest("Invalid CommID");
        }

        const deleted = await CommLog.findByIdAndDelete(CommID);

        if (!deleted) throw createHttpError.NotFound("CommLog not found");

        res.json({
            message: "CommLog deleted Successfully",
            data: deleted
        });
    } catch (err) {
        next(err);
    }
}


const getCommLogsForEntity = async (req, res, next) => {
    try {
        const { entityType, entityId } = req.body;

        if (!['Client', 'Talent', 'Gig'].includes(entityType)) {
            throw createHttpError.BadRequest("Invalid entity type");
        }

        if (!mongoose.Types.ObjectId.isValid(entityId)) {
            throw createHttpError.BadRequest("Invalid entityId");
        }

        if (entityType === "Client") {
            const existingClient = await Client.findById(entityId)
            if (!existingClient) throw createHttpError.NotFound("Client Not Found")
        } else if (entityType === "Talent") {
            const existingTalent = await Talent.findById(entityId)
            if (!existingTalent) throw createHttpError.NotFound("Talent Not Found")
        } else {
            const existingGig = await Gig.findById(entityId)
            if (!existingGig) throw createHttpError.NotFound("Gig Not Found")
        }

        const logs = await CommLog.find({
            linkedToModel: entityType,
            linkedTo: entityId
        }).populate({ path: "createdBy", select: "-password" }).sort({ createdAt: -1 });

        res.json({
            message: `Feched Logs for ${entityType}`,
            data: logs
        })
    } catch (err) {
        next(err);
    }
}




module.exports = {
    listCommLogs,
    getSingleCommLog,
    createCommLog,
    updateCommLog,
    deleteCommLog,
    getCommLogsForEntity
}