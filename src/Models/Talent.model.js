// models/Talent.js
const mongoose = require('mongoose');

const talentSchema = new mongoose.Schema({
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
        required: true,
        unique: true
    },

    skillset: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length > 0;
            },
            message: "Skillset cannot be empty."
        }
    },

    profilePicUrl: String,

    notes: [String], // Feedback, preferences

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

module.exports = mongoose.model('Talent', talentSchema);
