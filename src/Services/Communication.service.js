const mongoose = require("mongoose")
const createHttpError = require("http-errors");

const validate_CommLogCreatePayload = (data) => {

    const validLinkedModels = ['Client', 'Talent', 'Gig'];
    const validTypes = ['note', 'audio', 'chat', 'transcription'];
    const validSources = ['Manual', 'Fireflies', 'GMeet', 'WhatsApp', 'Twilio'];


    const {
        linkedToModel,
        linkedTo,
        type,
        source,
        content,
        summary,
        fileLink,
        sender,
        receivedAt
    } = data;

    // Validate linkedToModel
    if (!linkedToModel || !validLinkedModels.includes(linkedToModel)) {
        throw createHttpError.BadRequest(`'linkedToModel' must be one of: ${validLinkedModels.join(', ')}`);
    }

    // Validate linkedTo ObjectId
    if (!linkedTo || !mongoose.Types.ObjectId.isValid(linkedTo)) {
        throw createHttpError.BadRequest(`'linkedTo' must be a valid Mongo ObjectId`);
    }

    // Validate type
    if (!type || !validTypes.includes(type)) {
        throw createHttpError.BadRequest(`'type' must be one of: ${validTypes.join(', ')}`);
    }

    // Validate source
    if (!source || !validSources.includes(source)) {
        throw createHttpError.BadRequest(`'source' must be one of: ${validSources.join(', ')}`);
    }

    // Optional: If type is "audio" or "chat", fileLink is recommended
    if ((type === 'audio' || type === 'chat') && !fileLink) {
        throw createHttpError.BadRequest(`'fileLink' is required for type '${type}'`);
    }

    // Optional: receivedAt should be a valid date if present
    if (receivedAt && isNaN(Date.parse(receivedAt))) {
        throw createHttpError.BadRequest(`'receivedAt' must be a valid date`);
    }

    // Optional: content should be a string
    if (content && typeof content !== 'string') {
        throw createHttpError.BadRequest(`'content' must be a string`);
    }

    // Optional: summary should be a string
    if (summary && typeof summary !== 'string') {
        throw createHttpError.BadRequest(`'summary' must be a string`);
    }

    // Optional: sender should be a string
    if (sender && typeof sender !== 'string') {
        throw createHttpError.BadRequest(`'sender' must be a string`);
    }

    return true; // All checks passed
};



const validate_CommLogUpdatePayload = (data) => {

    const validLinkedModels = ['Client', 'Talent', 'Gig'];
    const validTypes = ['note', 'audio', 'chat', 'transcription'];
    const validSources = ['Manual', 'Fireflies', 'GMeet', 'WhatsApp', 'Twilio'];

    const {
        linkedToModel,
        linkedTo,
        type,
        source,
        content,
        summary,
        fileLink,
        sender,
        receivedAt,
        isImportant,
        tags
    } = data;

    if (linkedToModel && !validLinkedModels.includes(linkedToModel)) {
        throw createHttpError.BadRequest(`'linkedToModel' must be one of: ${validLinkedModels.join(', ')}`);
    }

    if (linkedTo && !mongoose.Types.ObjectId.isValid(linkedTo)) {
        throw createHttpError.BadRequest(`'linkedTo' must be a valid ObjectId`);
    }

    if (type && !validTypes.includes(type)) {
        throw createHttpError.BadRequest(`'type' must be one of: ${validTypes.join(', ')}`);
    }

    if (source && !validSources.includes(source)) {
        throw createHttpError.BadRequest(`'source' must be one of: ${validSources.join(', ')}`);
    }

    if (receivedAt && isNaN(Date.parse(receivedAt))) {
        throw createHttpError.BadRequest(`'receivedAt' must be a valid ISO date string`);
    }

    if (content && typeof content !== 'string') {
        throw createHttpError.BadRequest(`'content' must be a string`);
    }

    if (summary && typeof summary !== 'string') {
        throw createHttpError.BadRequest(`'summary' must be a string`);
    }

    if (fileLink && typeof fileLink !== 'string') {
        throw createHttpError.BadRequest(`'fileLink' must be a string`);
    }

    if (sender && typeof sender !== 'string') {
        throw createHttpError.BadRequest(`'sender' must be a string`);
    }

    if (isImportant !== undefined && typeof isImportant !== 'boolean') {
        throw createHttpError.BadRequest(`'isImportant' must be a boolean`);
    }

    if (tags && !Array.isArray(tags)) {
        throw createHttpError.BadRequest(`'tags' must be an array of strings`);
    }

};


module.exports = {
    validate_CommLogCreatePayload,
    validate_CommLogUpdatePayload
}