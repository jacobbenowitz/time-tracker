const Validator = require('validator');
const validText = require('./valid-text');

module.exports = function validateTimeEntry(data) {
    let errors = {};

    data.user_id = data.user_id ? data.user_id : 0;
    data.title = validText(data.title) ? data.title : '';
    data.description = validText(data.description) ? data.description : '';
    data.status = validText(data.status) ? data.status : '';
    data.start_time = validText(data.start_time) ? data.start_time : '';
    data.end_time = validText(data.end_time) ? data.end_time : '';

    if (!Validator.isLength(data.title, { min: 2, max: 150 })) {
        errors.username = 'Title must be between 2 and 150 characters';
    }

    if (data.description &&
        !Validator.isLength(data.description, { min: 2, max: 5000 })
    ) {
        errors.description =
            'Description must be between 2 and 5000 characters';
    }

    if (data.status && !Validator.isLength(data.status, { min: 2, max: 50 })) {
        errors.status = 'Status must be between 2 and 50 characters';
    }

    if (!Validator.isInt(data.user_id.toString()) && data.user_id !== 0) {
        errors.user_id = 'UserId is invalid';
    }

    if (new Date(data.start_time) == 'Invalid Date') {
        errors.start_time = 'Start time is invalid';
    }

    if (new Date(data.end_time) == 'Invalid Date') {
        errors.end_time = 'End time is invalid';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};