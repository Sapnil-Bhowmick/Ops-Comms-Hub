// models/Gig.js
const mongoose = require('mongoose');


const DeliverableSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['file', 'link', 'note', 'update'],
            required: true
        },
        name: String,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        },

        dueDate: Date,
        info: String
    }
);

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'in_progress', 'delivered', 'archived'],
        default: 'draft',
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    talentId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Talent'
        }
    ],
    description: String,
    deliverables: [DeliverableSchema],
    timeline: {
        startDate: Date,
        endDate: Date
    },
    updates: [{
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Gig', gigSchema);
