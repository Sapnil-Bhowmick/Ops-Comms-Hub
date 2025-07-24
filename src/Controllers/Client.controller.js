
const Client = require("../Models/Client.model.js")
const createHTTPError = require("http-errors")
const { validateClient, validateClientUpdate } = require("../Services/Client.service.js")
const createHttpError = require("http-errors")

const mongoose = require("mongoose")

// & populate gigs
const listClients = async (req, res, next) => {
    try {
        const clients = await Client.find()
            .populate(
                [
                    { path: "createdBy", select: "-password" },
                    { path: "linkedGigs" }
                ]
            );
        res.json({
            message: "All Clients Feteched Succesfully",
            data: clients
        })
    }
    catch (err) {
        next(err)
    }
}


// & populate gigs
const getSingleClient = async (req, res, next) => {
    console.log("get client")
    try {
        const client = await Client.findById(req.params.clientID)
            .populate(
                [
                    { path: "createdBy", select: "-password" },
                    { path: "linkedGigs" }
                ]
            );

        if (!client) {
            throw createHttpError.NotFound("Client not found")
        }
        res.json({
            message: "Client Fetched Successfully",
            data: client
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



const createClient = async (req, res, next) => {
    try {
        validateClient(req)
        const { userID, role } = req.LoggedIn_UserInfo
        let client = new Client({ ...req.body, createdBy: userID });
        await client.save();

        return res.json({
            message: "Client Created Successfully",
            data: client
        })

    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const updateClient = async (req, res, next) => {
    const { clientID } = req.params;

    // Checking for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(clientID)) {
        throw createHTTPError.BadRequest("Invalid client ID format.")
    }

    // Validating and filtering update fields
    const updates = await validateClientUpdate(req.body);
    if (Object.keys(updates).length === 0) {
        throw createHTTPError.BadRequest("No valid fields provided to update.")
    }

    // Adding updatedAt field
    updates.updatedAt = new Date();

    try {
        // Performing update
        const updatedClient = await Client.findByIdAndUpdate(
            clientID,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate(
                [
                    { path: "createdBy", select: "-password" },
                    { path: "linkedGigs" }
                ]
            );

        if (!updatedClient) {
            throw createHTTPError.NotFound("Client not found.")
        }

        res.json(
            {
                message: 'Client updated successfully.',
                client: updatedClient
            }
        );

    } catch (err) {
        next(err)
    }
}

const deleteClient = async (req, res, next) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.clientID);
        if (!deletedClient) {
            throw createHTTPError.NotFound("Client Not Found")
        }

        res.json({
            message: "Client Deleted Successfully",
            data: deletedClient
        })
    }
    catch (err) {
        next(err)
    }
}



const addNotesToClient = async (req, res, next) => {
    try {
        const { clientID } = req.params;
        const { notes } = req.body;

        if (!Array.isArray(notes) || notes.length === 0) {
            throw createHTTPError.BadRequest("Notes must be a non-empty array.")
        }

        const updatedClient = await Client.findByIdAndUpdate(
            clientID,
            {
                $push: {
                    notes: { $each: notes }
                },
                $set: {
                    updatedAt: new Date()
                }
            },
            { new: true }
        ).populate(
            [
                { path: "createdBy", select: "-password" },
                { path: "linkedGigs" }
            ]
        );

        if (!updatedClient) {
            throw createHTTPError.NotFound("Client not found.")
        }

        res.status(200).json({
            message: "Notes added successfully.",
            client: updatedClient
        });

    } catch (err) {
        next(err)
    }
}



const LinkGigsToClient = async (req, res, next) => {
    try {
        const { clientID } = req.params;
        const { gigIds } = req.body; // expects an array of ObjectId strings

        if (!Array.isArray(gigIds) || gigIds.length === 0) {
            throw createHTTPError.BadRequest("GigIds must be a non-empty array.")
        }

        // Validate each gigId
        const invalidIds = gigIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            const err = createHTTPError.BadRequest("Invalid gig IDs provided.")
            err.invalidIds = invalidIds;
            throw err;
        }

        const updatedClient = await Client.findByIdAndUpdate(
            clientID,
            {
                // To prevent duplicates
                $addToSet: {
                    linkedGigs: { $each: gigIds }
                },
                $set: {
                    updatedAt: new Date()
                }
            },
            { new: true }
        )
            .populate(
                [
                    { path: "createdBy", select: "-password" },
                    { path: "linkedGigs" }
                ]
            );

        if (!updatedClient) {
            throw createHTTPError.NotFound("Client not found.")
        }

        res.json({
            message: "Gigs linked to client successfully.",
            client: updatedClient
        });

    } catch (err) {
        next(err)
    }
};




module.exports = {
    listClients,
    getSingleClient,
    createClient,
    updateClient,
    deleteClient,
    addNotesToClient,
    LinkGigsToClient
}