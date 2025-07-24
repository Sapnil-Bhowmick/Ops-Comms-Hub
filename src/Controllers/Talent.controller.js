const { validateCreateTalent, validateTalentUpdate } = require("../Services/Talent.service")
const createHTTPError = require("http-errors")
const Talent = require("../Models/Talent.model.js")
const createHttpError = require("http-errors")

const Gig = require("../Models/Gig.model.js")
const mongoose = require("mongoose")

const listTalents = async (req, res, next) => {
    try {
        const talents = await Talent.find()
            .populate(
                [
                    { path: 'createdBy', select: '-password' },
                    { path: 'linkedGigs' }
                ]
            )

        res.json({
            message: "Talents Fetched Successfully",
            data: talents
        });
    } catch (err) {
        next(err);
    }
}



const getSingleTalent = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.talentID)) {
            throw createHttpError.BadRequest("Invalid Talent ID");
        }

        // Only allow TALENT to access their own data
        if (role === "TALENT" && userID.toString() !== req.params.talentID) {
            throw createHttpError.Forbidden("You are not authorized to view this talent.");
        }

        const talent = await Talent.findById(req.params.talentID)
            .populate(
                [
                    { path: 'createdBy', select: '-password' },
                    { path: 'linkedGigs' }
                ]
            )

        if (!talent) throw createHTTPError.NotFound("Talent not found");
        res.json({
            message: "Talent Fetched Successfully",
            data: talent
        })
    } catch (err) {
        next(err);
    }
}



const createTalent = async (req, res, next) => {
    try {
        await validateCreateTalent(req)

        const { userID, role } = req.LoggedIn_UserInfo

        console.log(req.body)

        const isPhoneExists = await Talent.find({ phone: req.body.phone })
        if (isPhoneExists.length !== 0) {
            throw createHttpError("Phone Number already exists")
        }

        let newTalent = {
            ...req.body,
            createdBy: userID
        }
        newTalent = await Talent.create(newTalent);
        res.json({
            message: "Talent Created Successfully",
            data: newTalent
        })
    } catch (err) {
        next(err);
    }
}

const updateTalent = async (req, res, next) => {
    try {

        validateTalentUpdate(req.body)

        if (!mongoose.Types.ObjectId.isValid(req.params.talentID)) {
            throw createHttpError.BadRequest("Invalid Talent ID");
        }

        const updatedTalent = await Talent.findByIdAndUpdate(
            req.params.talentID,
            {
                $set: {
                    ...req.body,
                    updatedAt: Date.now()
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate(
            [
                { path: 'createdBy', select: '-password' },
                { path: 'linkedGigs' }
            ]
        )

        if (!updatedTalent) {
            throw createHTTPError.NotFound("Talent not found");
        }

        res.json({ message: "Talent Updated successfully.", data: updatedTalent });
    } catch (err) {
        next(err);
    }
}

const deleteTalent = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.talentID)) {
            throw createHttpError.BadRequest("Invalid Talent ID");
        }
        const deletedTalent = await Talent.findByIdAndDelete(req.params.talentID)
            .populate(
                [
                    { path: 'createdBy', select: '-password' },
                    { path: 'linkedGigs' }
                ]
            )
        if (!deletedTalent) throw createHTTPError.NotFound("Talent not found");
        res.json({ message: "Talent deleted successfully.", data: deletedTalent });
    } catch (err) {
        next(err);
    }
}



const addNotes = async (req, res, next) => {
    try {
        const { notes } = req.body;
        if (!Array.isArray(notes) || notes.length === 0)
            throw createHTTPError.BadRequest("Notes must be a non-empty array.");

        if (!mongoose.Types.ObjectId.isValid(req.params.talentID)) {
            throw createHttpError.BadRequest("Invalid Talent ID");
        }

        const updatedTalent = await Talent.findByIdAndUpdate(
            req.params.talentID,
            { $push: { notes: { $each: notes } }, updatedAt: Date.now() },
            { new: true }
        ).populate(
            [
                { path: 'createdBy', select: '-password' },
                { path: 'linkedGigs' }
            ]
        )
        if (!updatedTalent) throw createHTTPError.NotFound("Talent not found");
        res.json(updatedTalent);
    } catch (err) {
        next(err);
    }
}


const LinkGigsToTalent = async (req, res, next) => {
    try {
        const { gigIds } = req.body;
        if (!Array.isArray(gigIds) || gigIds.length === 0)
            throw createHTTPError.BadRequest("GigIds must be a non-empty array.");

        if (!mongoose.Types.ObjectId.isValid(req.params.talentID)) {
            throw createHttpError.BadRequest("Invalid Talent ID");
        }

        const gigs = await Gig.find({ _id: { $in: gigIds } });
        const foundIds = gigs.map(g => g._id.toString());
        const invalidIds = gigIds.filter(id => !foundIds.includes(id));

        if (invalidIds.length > 0) {
            const err = createHTTPError.BadRequest("Invalid gig IDs provided.");
            err.invalidIds = { invalidIds };
            throw err;
        }

        const updatedTalent = await Talent.findByIdAndUpdate(
            req.params.talentID,
            { $addToSet: { linkedGigs: { $each: gigIds } }, updatedAt: Date.now() },
            { new: true }
        ).populate(
            [
                { path: 'createdBy', select: '-password' },
                { path: 'linkedGigs' }
            ]
        )

        if (!updatedTalent) throw createHTTPError.NotFound("Talent not found");

        res.json({
            message: "Gigs Added Successfully",
            data: updatedTalent
        });

    } catch (err) {
        next(err);
    }
}



module.exports = {
    listTalents,
    getSingleTalent,
    createTalent,
    updateTalent,
    deleteTalent,
    addNotes,
    LinkGigsToTalent
}