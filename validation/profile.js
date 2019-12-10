const Validator = require('validator');
const is_Empty = require('./isEmpty');

module.exports = function validateProfileInput(data){
    let errors = {};

    data.handle = !is_Empty(data.handle) ? data.handle : '';
    data.skills = !is_Empty(data.skills) ? data.skills : '';
    data.status = !is_Empty(data.status) ? data.status : '';

    if(!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = 'Handle needs to between 2 and 40 characters';
    }

    if(Validator.isEmpty(data.handle)){
        errors.handle = 'Handle field is required';
    }

    if(Validator.isEmpty(data.skills)){
        errors.skills = 'Skills field is required';
    }

    if(Validator.isEmpty(data.status)){
        errors.status = 'Status field is required';
    }

    //website URL형태로 넣어줘야 한다는 조건
    if(!is_Empty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid: is_Empty(errors)
    };
};