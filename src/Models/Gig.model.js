
const mongoose = require('mongoose');

const DeliverableSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['file', 'link', 'note', 'update'],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending',
            required: true
        },

        dueDate: Date,
        info: {
            type: String,
            required: true
        }
    }
);

const UpdatesSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
)

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['draft', 'in_progress', 'delivered', 'archived'],
        default: 'draft',
        required: true
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

    description: {
        type: String,
        required: true
    },

    deliverables: [DeliverableSchema],

    timeline: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
    },

    updates: [UpdatesSchema],

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
    }
});

module.exports = mongoose.model('Gig', gigSchema);
