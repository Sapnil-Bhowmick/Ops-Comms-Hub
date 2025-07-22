const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    company: String,

    address:  {
        type: String,
        required: true
    },

    notes: [String], // Internal notes

    linkedGigs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gig'
        }
    ],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Client', clientSchema);
