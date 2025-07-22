const createHTTPError = require("http-errors")
const validator = require("validator")

const Gig = require("../Models/Gig.model.js")

const validateCreateTalent = async (req) => {
    const { name, email, phone, skillset, notes, linkedGigs } = req.body;

    if (!name || !email || !phone || !skillset) {
        throw createHTTPError.BadRequest("Please provide the required fields");
    }

    if (!Array.isArray(skillset) || skillset.length === 0) {
        throw createHTTPError.BadRequest("Skillset should be an array");
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
        throw createHTTPError.BadRequest("Client name is required and must be at least 2 characters.");
    }

    if (!email || !validator.isEmail(email)) {
        throw createHTTPError.BadRequest("A valid email address is required.");
    }

    if (!phone || !validator.isMobilePhone(phone, 'any')) {
        throw createHTTPError.BadRequest("A valid phone number is required.");
    }

    if (notes && (notes.length === 0 || !Array.isArray(notes))) {
        throw createHTTPError.BadRequest("Notes should be non-empty array");
    }

    if (linkedGigs && (linkedGigs.length === 0 || !Array.isArray(linkedGigs))) {
        throw createHTTPError.BadRequest("linkedGigs should be non-empty array");
    }


    if (linkedGigs) {
        // To check for invalid Gig Id's
        const gigs = await Gig.find({ _id: { $in: linkedGigs } });
        const foundIds = gigs.map(g => g._id.toString());
        const invalidIds = linkedGigs.filter(id => !foundIds.includes(id));

        if (invalidIds.length > 0) {
            const err = createHTTPError.BadRequest("Invalid gig IDs provided.");
            err.invalidIds = { invalidIds };
            throw err;
        }
    }

}



module.exports = {
    validateCreateTalent
}