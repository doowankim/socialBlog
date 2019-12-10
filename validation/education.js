const Validator = require('validator');
const is_Empty = require('./isEmpty');

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !is_Empty(data.school) ? data.school : '';
    data.degree = !is_Empty(data.degree) ? data.degree : '';
    data.fieldofstudy = !is_Empty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !is_Empty(data.from) ? data.from : '';

    if(Validator.isEmpty(data.school)){
        errors.school = 'School field is required'
    }

    if(Validator.isEmpty(data.degree)){
        errors.degree = 'Degree field is required'
    }

    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'Fieldofstudy field is required'
    }

    if(Validator.isEmpty(data.from)){
        errors.from = 'From field is required'
    }

    return {
        errors,
        isValid: is_Empty(errors)
    };
};