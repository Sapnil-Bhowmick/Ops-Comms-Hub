
const createHttpError = require("http-errors")
const Gig = require("../Models/Gig.model.js")


const listGigs = async (req, res, next) => {
    try {
        const Gigs = await Gig.find()
            .populate({ path: "createdBy", select: "-password" });
        res.json({
            message: "All Clients Feteched Succesfully",
            data: Gigs
        })
    }
    catch (err) {
        next(err)
    }
}



const getSingleGig = async (req, res, next) => {
    try {

    }
    catch (err) {
        next(err)
    }
}



const createGig = async (req, res, next) => {
    try {

    }
    catch (err) {
        next(err)
    }
}

const updateGig = async (req, res, next) => {
    try {

    }
    catch (err) {
        next(err)
    }
}

const deleteGig = async (req, res, next) => {
    try {

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
    deleteGig
}