// models/CommLog.js
const mongoose = require('mongoose');

const commLogSchema = new mongoose.Schema({
    linkedToModel: {
        type: String,
        enum: ['Client', 'Talent', 'Gig'],
        required: true
    },
    linkedTo: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'linkedToModel',
        required: true
    },
    type: {
        type: String,
        enum: ['note', 'audio', 'chat', 'transcription'],
        required: true
    },
    source: {
        type: String,
        enum: ['Manual', 'Fireflies', 'GMeet', 'WhatsApp', 'Twilio'],
        required: true
    },
    content: String,
    summary: String,
    // audio/video file or link
    fileLink: String,
    // For WhatsApp chats or external messages
    sender: String,
    receivedAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now , required: true },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CommLog', commLogSchema);
