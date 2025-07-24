const createHttpError = require("http-errors")
const validator = require("validator")

const Gig = require("../Models/Gig.model.js")

const validateClient = (req) => {
    const { name, email, company, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
        throw createHttpError.BadRequest("Please provide the required fields");
    }


    if (!name || typeof name !== "string" || name.trim().length < 2) {
        throw createHttpError.BadRequest("Client name is required and must be at least 2 characters.");
    }

    if (!email || !validator.isEmail(email)) {
        throw createHttpError.BadRequest("A valid email address is required.");
    }

    if (!company || typeof company !== "string" || company.trim().length < 2) {
        throw createHttpError.BadRequest("Company name is required and must be at least 2 characters.");
    }

    if (!phone || !validator.isMobilePhone(phone, 'any')) {
        throw createHttpError.BadRequest("A valid phone number is required.");
    }

    if (!address || typeof address !== "string" || address.trim().length < 4) {
        throw createHttpError.BadRequest("Address is required and must be at least 5 characters.");
    }
}





// Helper to validate allowed fields
const validateClientUpdate = async(body) => {
    const allowedFields = ['name', 'email', 'phone', 'company', 'address', "linkedGigs", "notes"];
    const updates = {};

    console.log("BODY -------> " , body.notes)

    for (let field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    if (body.notes && (body.notes.length === 0 || !Array.isArray(body.notes))) {
        throw createHttpError.BadRequest("Notes should be non-empty array");
    }

    if (body.linkedGigs && (body.linkedGigs.length === 0 || !Array.isArray(linkedGigs))) {
        throw createHttpError.BadRequest("linkedGigs should be non-empty array");
    }


    if (body.linkedGigs) {
        // To check for invalid Gig Id's
        const gigs = await Gig.find({ _id: { $in: body.linkedGigs } });
        const foundIds = gigs.map(g => g._id.toString());
        const invalidIds = body.linkedGigs.filter(id => !foundIds.includes(id));

        if (invalidIds.length > 0) {
            const err = createHttpError.BadRequest("Invalid gig IDs provided.");
            err.invalidIds = { invalidIds };
            throw err;
        }
    }


    return updates;
};


module.exports = {
    validateClient,
    validateClientUpdate
}