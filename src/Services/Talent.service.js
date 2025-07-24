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



const validateTalentUpdate = (data) => {
    const allowedFields = ['name', 'email', 'phone', 'skillset', 'profilePicUrl', 'notes', 'linkedGigs'];
    const keys = Object.keys(data);

    console.log(keys)

    // Check for invalid fields
    const invalidFields = keys.filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
        throw createHTTPError.BadRequest(`Invalid fields in update: ${invalidFields.join(', ')}`);
    }

    // Check Specific Fields
    if (data.name && typeof data.name !== 'string') {
        throw createHTTPError.BadRequest("Name must be a string.");
    }

    if (data.email && typeof data.email !== 'string') {
        throw createHTTPError.BadRequest("Email must be a string.");
    }

    if (data.phone && !/^\d{10}$/.test(data.phone)) {
        throw createHTTPError.BadRequest("Phone number must be 10 digits.");
    }

    if (data.skillset) {
        if (!Array.isArray(data.skillset) || data.skillset.length === 0 || !data.skillset.every(s => typeof s === 'string')) {
            throw createHTTPError.BadRequest("Skillset must be a non-empty array of strings.");
        }
    }

    if (data.notes && !Array.isArray(data.notes)) {
        throw createHTTPError.BadRequest("Notes must be an array.");
    }

    if (data.linkedGigs && !Array.isArray(data.linkedGigs)) {
        throw createHTTPError.BadRequest("linkedGigs must be an array of IDs.");
    }
}



module.exports = {
    validateCreateTalent,
    validateTalentUpdate
}