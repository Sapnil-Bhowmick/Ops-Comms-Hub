const mongoose = require('mongoose');
const createHttpError = require("http-errors")
const Gig = require("../Models/Gig.model.js");
const {
    validateGigPayload,
    validateGigUpdatePayload,
    validateUpdateArray,
    validateDeliverables
} = require("../Services/Gig.service.js");


const Client = require("../Models/Client.model.js")

const listGigs = async (req, res, next) => {
    try {
        const Gigs = await Gig.find()
            .populate([
                { path: 'clientId' },
                { path: 'talentId' },
                { path: 'createdBy' },
                { path: "updates.updatedBy" }
            ]);

        res.json({
            message: "All Gigs Feteched Succesfully",
            data: Gigs
        })

    }
    catch (err) {
        next(err)
    }
}



const getSingleGig = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.GigID)) {
            throw createHttpError.BadRequest("Invalid Gig ID");
        }

        const { userID, role } = req.LoggedIn_UserInfo

        // Only allow TALENT to access the Gigs which are assigned to them
        if (role === "TALENT") {
            const gig = await Gig.findById(req.params.GigID)
            if (!gig.talentId.includes(userID)) {
                throw createHttpError.Forbidden("Gig is not assigned to you.");
            }
        }

        // Only allow client to access the Gig which is their requirement
        if (role === "CLIENT") {
            const gig = await Gig.findById(req.params.GigID)
            if (!gig.clientId.toString() === userID.toString()) {
                throw createHttpError.Forbidden("Gig is not assigned to you.");
            }
        }

        const gig = await Gig.findById(req.params.GigID)
            .populate([
                { path: 'clientId' },
                { path: 'talentId' },
                { path: 'createdBy', select: '-password' },
                { path: "updates.updatedBy", select: '-password' }
            ]);

        if (!gig) throw createHttpError.NotFound('Gig not found');

        res.json({
            message: "Gig Fetched Successfully",
            data: gig
        });

    } catch (err) {
        next(err);
    }

}



const createGig = async (req, res, next) => {
    try {
        validateGigPayload(req.body)

        const isClientExists = await Client.findById(req.body.clientId)
        if (!isClientExists) throw createHttpError.BadRequest("Client Does Not Exist")

        const { userID, role } = req.LoggedIn_UserInfo

        const payload = {
            ...req.body,
            createdBy: userID
        }

        const gig = new Gig(payload);
        const savedGig = await gig.save();
        res.json({
            message: "Gig Created Successfully",
            data: savedGig
        })
    } catch (err) {
        next(err);
    }
}

const updateGig = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.GigID)) {
            throw createHttpError.BadRequest("Invalid Gig ID");
        }

        validateGigUpdatePayload(req.body)

        const gig = await Gig.findByIdAndUpdate(
            req.params.GigID,
            { $set: { ...req.body, updatedAt: Date.now() } },
            { new: true, runValidators: true }
        );

        if (!gig) throw createHttpError.NotFound('Gig not found');

        res.json({
            message: "Gig Updated Successfully",
            data: gig
        });

    } catch (err) {
        next(err);
    }
}

const deleteGig = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.GigID)) {
            throw createHttpError.BadRequest("Invalid Gig ID");
        }

        const deletedGig = await Gig.findByIdAndDelete(req.params.GigID);

        if (!deletedGig) throw createHttpError.NotFound('Gig not found');

        res.json({ message: 'Gig deleted', data: deletedGig });
    } catch (err) {
        next(err);
    }
}



const addGigUpdates = async (req, res, next) => {
    try {
        const gigId = req.params.GigID;
        if (!mongoose.Types.ObjectId.isValid(gigId)) {
            throw createHttpError.BadRequest("Invalid Gig ID");
        }

        validateUpdateArray(req.body.updates);

        const { userID, role } = req.LoggedIn_UserInfo

        // Only allow TALENT to access the Gigs which are assigned to them
        if (role === "TALENT") {
            const gig = await Gig.findById(req.params.GigID)
            if (!gig.talentId.includes(userID)) {
                throw createHttpError.Forbidden("Gig is not assigned to you.");
            }
        }

        const updatesArr = req.body.updates.map(update => ({
            text: update.text,
            createdAt: update.createdAt || new Date(),
            updatedBy: update.updatedBy
        }));

        const updatedGig = await Gig.findByIdAndUpdate(
            gigId,
            { $push: { updates: { $each: updatesArr } }, $set: { updatedAt: Date.now() } },
            { new: true }
        );

        if (!updatedGig) throw createHttpError.NotFound("Gig not found");

        res.json({
            message: "Added Updates to Gig Successfully",
            data: updatedGig
        })

    } catch (err) {
        next(err);
    }
}



const addGigDeliverables = async (req, res, next) => {
    try {

        const gigId = req.params.GigID;
        if (!mongoose.Types.ObjectId.isValid(gigId)) {
            throw createHttpError.BadRequest("Invalid Gig ID");
        }

        const deliverables = req.body.deliverables;

        validateDeliverables(deliverables);

        const { userID, role } = req.LoggedIn_UserInfo

        // Only allow TALENT to access the Gigs which are assigned to them
        if (role === "TALENT") {
            const gig = await Gig.findById(req.params.GigID)
            if (!gig.talentId.includes(userID)) {
                throw createHttpError.Forbidden("Gig is not assigned to you.");
            }
        }

        const updatedGig = await Gig.findByIdAndUpdate(
            gigId,
            {
                $push: {
                    deliverables: { $each: deliverables },
                },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );

        if (!updatedGig) {
            throw createHttpError.NotFound("Gig not found.");
        }

        res.status(200).json({
            message: "Deliverables added successfully.",
            data: updatedGig,
        });

    } catch (err) {
        next(err);
    }
}



const addTalent = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.GigID)) {
            throw createHttpError.BadRequest("Invalid Gig ID");
        }

        const talents = req.body.talentId
        const invalidIds = talents.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            const err = createHttpError.BadRequest("Invalid gig IDs provided.")
            err.invalidIds = invalidIds;
            throw err;
        }

        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.GigID,
            {
                // To prevent duplicates
                $addToSet: {
                    talentId: { $each: talents }
                },
                $set: {
                    updatedAt: new Date()
                }
            },
            { new: true }
        )

        res.json({
            message: "Talent added Successfully",
            data: updatedGig
        })
    }
    catch (err) {
        next(err)
    }
}


const deleteTalent = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.GigID)) {
            throw createHttpError.BadRequest("Invalid Gig ID");
        }

        const talentID = req.body.talentID

        let gig = await Gig.findById(req.params.GigID)
        const filteredTalent_Ids = gig.talentId.filter((talent_ID) => talent_ID.toString() !== talentID.toString())

        gig.talentId = filteredTalent_Ids
        gig = await Gig.create(gig)

        res.json({
            message: "Talent Deleted Successfully",
            data: gig
        })
    }
    catch (err) {
        next(err)
    }
}




module.exports = {
    listGigs,
    getSingleGig,
    createGig,
    updateGig,
    deleteGig,
    addGigUpdates,
    addGigDeliverables,
    addTalent,
    deleteTalent
}