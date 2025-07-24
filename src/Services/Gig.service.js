const mongoose = require("mongoose");
const createHTTPError = require("http-errors");



const validateGigPayload = (data) => {
    if (!data.title || typeof data.title !== 'string') {
        throw createHTTPError.BadRequest("Title is required and must be a string.");
    }

    const validStatuses = ['draft', 'in_progress', 'delivered', 'archived'];
    if (!data.status || !validStatuses.includes(data.status)) {
        throw createHTTPError.BadRequest(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    if (!data.clientId || !mongoose.Types.ObjectId.isValid(data.clientId)) {
        throw createHTTPError.BadRequest("Valid clientId is required.");
    }

    if (data.talentId) {
        if (!Array.isArray(data.talentId)) {
            throw createHTTPError.BadRequest("talentId must be an array.");
        }
        for (let id of data.talentId) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw createHTTPError.BadRequest(`Invalid talentId: ${id}`);
            }
        }
    }

    if (!data.description || typeof data.description !== 'string') {
        throw createHTTPError.BadRequest("Description is required and must be a string.");
    }

    if (!data.timeline || typeof data.timeline !== 'object') {
        throw createHTTPError.BadRequest("Timeline must be provided as an object.");
    }

    if (!data.timeline.startDate || isNaN(Date.parse(data.timeline.startDate))) {
        throw createHTTPError.BadRequest("Valid timeline.startDate is required.");
    }

    if (!data.timeline.endDate || isNaN(Date.parse(data.timeline.endDate))) {
        throw createHTTPError.BadRequest("Valid timeline.endDate is required.");
    }

    // if (!data.createdBy || !mongoose.Types.ObjectId.isValid(data.createdBy)) {
    //     throw createHTTPError.BadRequest("Valid createdBy is required.");
    // }

    // Optional: Validate deliverables format
    if (data.deliverables) {
        if (!Array.isArray(data.deliverables)) {
            throw createHTTPError.BadRequest("Deliverables must be an array.");
        }

        const validTypes = ['file', 'link', 'note', 'update'];
        const validStatuses = ['pending', 'in_progress', 'completed'];

        for (const item of data.deliverables) {
            if (!item.type || !validTypes.includes(item.type)) {
                throw createHTTPError.BadRequest(`Deliverable type must be one of: ${validTypes.join(', ')}`);
            }
            if (item.status && !validStatuses.includes(item.status)) {
                throw createHTTPError.BadRequest(`Deliverable status must be one of: ${validStatuses.join(', ')}`);
            }
            if (item.dueDate && isNaN(Date.parse(item.dueDate))) {
                throw createHTTPError.BadRequest("Deliverable dueDate must be a valid date.");
            }
            if (!item.info) {
                throw createHTTPError.BadRequest("Deliverable Info is required");
            }
        }
    }

}


const validateGigUpdatePayload = (data) => {
    if (data.title && typeof data.title !== 'string') {
        throw createHTTPError.BadRequest("Title must be a string.");
    }

    if (data.status) {
        const validStatuses = ['draft', 'in_progress', 'delivered', 'archived'];
        if (!validStatuses.includes(data.status)) {
            throw createHTTPError.BadRequest(`Status must be one of: ${validStatuses.join(', ')}`);
        }
    }

    if (data.clientId && !mongoose.Types.ObjectId.isValid(data.clientId)) {
        throw createHTTPError.BadRequest("clientId must be a valid ObjectId.");
    }

    if (data.talentId) {
        if (!Array.isArray(data.talentId)) {
            throw createHTTPError.BadRequest("talentId must be an array.");
        }
        for (const id of data.talentId) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw createHTTPError.BadRequest(`Invalid talentId: ${id}`);
            }
        }
    }

    if (data.description && typeof data.description !== 'string') {
        throw createHTTPError.BadRequest("Description must be a string.");
    }

    if (data.timeline) {
        if (typeof data.timeline !== 'object') {
            throw createHTTPError.BadRequest("Timeline must be an object.");
        }

        if (data.timeline.startDate && isNaN(Date.parse(data.timeline.startDate))) {
            throw createHTTPError.BadRequest("timeline.startDate must be a valid ISO date.");
        }

        if (data.timeline.endDate && isNaN(Date.parse(data.timeline.endDate))) {
            throw createHTTPError.BadRequest("timeline.endDate must be a valid ISO date.");
        }
    }

    if (data.createdBy && !mongoose.Types.ObjectId.isValid(data.createdBy)) {
        throw createHTTPError.BadRequest("createdBy must be a valid ObjectId.");
    }

    if (data.deliverables) {
        if (!Array.isArray(data.deliverables)) {
            throw createHTTPError.BadRequest("Deliverables must be an array.");
        }

        const validTypes = ['file', 'link', 'note', 'update'];
        const validStatuses = ['pending', 'in_progress', 'completed'];

        for (const item of data.deliverables) {
            if (item.type && !validTypes.includes(item.type)) {
                throw createHTTPError.BadRequest(`Deliverable type must be one of: ${validTypes.join(', ')}`);
            }
            if (item.status && !validStatuses.includes(item.status)) {
                throw createHTTPError.BadRequest(`Deliverable status must be one of: ${validStatuses.join(', ')}`);
            }
            if (item.dueDate && isNaN(Date.parse(item.dueDate))) {
                throw createHTTPError.BadRequest("Deliverable dueDate must be a valid date.");
            }
        }
    }

    return true; // Passed
}


const validateUpdateArray = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        throw createHTTPError.BadRequest("Updates must be a non-empty array.");
    }

    data.forEach((item, index) => {
        if (!item.text || typeof item.text !== 'string') {
            throw createHTTPError.BadRequest(`Update at index ${index} must have a valid 'note'.`);
        }

        if (!item.updatedBy || !mongoose.Types.ObjectId.isValid(item.updatedBy)) {
            throw createHTTPError.BadRequest(`Update at index ${index} must have a valid 'updatedBy' ObjectId.`);
        }

        if (item.createdAt && isNaN(Date.parse(item.createdAt))) {
            throw createHTTPError.BadRequest(`Update at index ${index} has invalid createdAt timestamp.`);
        }
    });
}



const validateDeliverables = (deliverables) => {
    if (!Array.isArray(deliverables)) {
        throw createHTTPError.BadRequest("Deliverables must be an array.");
    }

    deliverables.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) {
            throw createHTTPError.BadRequest(`Deliverable at index ${index} must be an object.`);
        }

        const { type, name, status, dueDate, info } = item;

        const validTypes = ['file', 'link', 'note', 'update'];
        if (!validTypes.includes(type)) {
            throw createHTTPError.BadRequest(`Invalid 'type' at index ${index}. Must be one of ${validTypes.join(', ')}.`);
        }

        if (!name || typeof name !== 'string') {
            throw createHTTPError.BadRequest(`'name' at index ${index} is required and must be a string.`);
        }

        const validStatuses = ['pending', 'in_progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            throw createHTTPError.BadRequest(`Invalid 'status' at index ${index}. Must be one of ${validStatuses.join(', ')}.`);
        }

        if (dueDate && isNaN(Date.parse(dueDate))) {
            throw createHTTPError.BadRequest(`Invalid 'dueDate' at index ${index}. Must be a valid date string.`);
        }

        if (!info || typeof info !== 'string') {
            throw createHTTPError.BadRequest(`'info' at index ${index} is required and must be a string.`);
        }
    });
}

module.exports = {
    validateGigPayload,
    validateGigUpdatePayload,
    validateUpdateArray,
    validateDeliverables
};
