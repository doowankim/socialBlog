const Validator = require('validator');
const is_Empty = require('./isEmpty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !is_Empty(data.title) ? data.title : '';
    data.company = !is_Empty(data.company) ? data.company : '';
    data.location = !is_Empty(data.location) ? data.location : '';
    data.from = !is_Empty(data.from) ? data.from : '';

    if(Validator.isEmpty(data.title)){
        errors.title = 'Title field is required'
    }

    if(Validator.isEmpty(data.company)){
        errors.company = 'Company field is required'
    }

    if(Validator.isEmpty(data.location)){
        errors.location = 'Location field is required'
    }

    if(Validator.isEmpty(data.from)){
        errors.from = 'From field is required'
    }

    return {
        errors,
        isValid: is_Empty(errors)
    };

};