const helpers = {};

helpers.optionSelected = (select_field, current_field) => {
    if(String(select_field) == String(current_field)){
        return 'selected';
    }
};

module.exports = helpers;