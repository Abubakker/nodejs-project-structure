/*
 @Purpose:to get requested data from url query string,url parameter or post body with some basic validation
 @use: require this request in every controller then use this methods
*/

/*

 allow types = number,int,boolean,string,float
 number = float : any number value (allow +-)
 boolean = bool : true/false
 int = integer : any number without point allow +-

*/

const { isValidDataType, utils } = require('./utils');

const { messages } = require('../../languages/request_validator_errors')

module.exports = class RequestData {
    constructor(Request, Response) {
        this.typeOfValue = 'string';
        this.isRequired = false;
        this.validation = {
            'error': 0,
            'error_code': 'REQUEST_DATA_INVALID',
            'details': {}
        }
        this.value = '';
        this.Request = Request;
        this.Response = Response;
        let lang = Request.lang || Request.query['lang'] || 'en';
        if (!messages[lang]) {
            console.log('Message not added in the language files for supporting this language');
            this.lang = 'en';
        } else this.lang = lang;
    }

    /**
     * 
     * @param String key 
     * @returns string
     */
    get(key) {
        return this.Request.query[key];
    }

    /**
     * 
     * @param String key 
     * @returns string
     */
    params(key) {
        return this.Request.params[key];
    }

    /**
     * 
     * @param String key 
     * @param boolean isRequired 
     * @param string name 
     * @param string custom_message 
     * @returns instance
     */
    post(key, isRequired = false, name = '', custom_message = '') {
        this.isRequired = isRequired;
        this.key = key;
        this.value = this.Request.body[key];
        this.typeOfValue = typeof this.Request.body[key];
        this.field_name = `"${name || key}"`;
        if (Array.isArray(this.value)) {
            for (let i in this.value) {
                if (this.value[i] == '') {
                    this.validation.error = this.validation.error + 1;
                    if (!this.validation.details[key]) this.validation.details[key] = [];
                    this.validation.details[key][i] = (custom_message != '') ? custom_message : this.field_name + ' ' + messages[this.lang]['FIELD_REQUIRED']
                }
            }
        }
        if (this.Request.body[key] !== 0 && this.Request.body[key] !== false) {
            if ((!this.Request.body[key] && isRequired == true)) {
                if (typeof this.validation.details[key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[key] = (custom_message != '') ? custom_message : this.field_name + ' ' + messages[this.lang]['FIELD_REQUIRED']
                }
                return this;
            }
        }

        if (typeof this.value == 'string') {
            this.value = this.value.trim();
        }
        return this;
    }
    /**
     * 
     * @param String key 
     * @param boolean isRequired 
     * @param string name 
     * @param string custom_message 
     * @returns instance
     */
    body(key, isRequired = false, name = '', custom_message = '') {
        return this.post(key, isRequired, name, custom_message);
    }

    /**
     * 
     * @param String type 
     * @param string custom_message 
     * @returns instance
     */
    type(type, custom_message = '') {
        let is_valid = true;

        type = type.toLowerCase();

        if (type == 'int') type = 'integer';
        else if (type == 'bool') type = 'boolean';
        else if (type == 'float') type = 'number';

        if (this.value || this.value === 0 || this.value === false) {
            is_valid = isValidDataType(this.value, type)
        }
        if (!is_valid) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (custom_message != '') ? custom_message : messages[this.lang][type.toUpperCase()] || 'Data should be a valid ' + type;
            }
        }
        if (['integer', 'number'].includes(type) && this.value == "") this.value = null;
        else if (['integer', 'number'].includes(type)) this.value = +this.value;
        return this;
    }

    /**
     * 
     * @param int length 
     * @param string custom_message 
     * @returns instance
     */

    length(length, custom_message = '') {
        if ((this.typeOfValue == 'string' && this.value.length != length)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (custom_message != '') ? custom_message : messages[this.lang].LENGTH_FN(length)
            }
        }
        return this;
    }

    /**
     * 
     * @param int length 
     * @param string custom_message 
     * @returns instance
     */
    minLength(length, custom_message = '') {
        if ((this.typeOfValue == 'string' && this.value.length < length)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (custom_message != '') ? custom_message : messages[this.lang].MIN_LENGTH_FN(length)
            }

        }
        return this;
    }

    maxLength(value, message = '') {

        if ((this.typeOfValue == 'string' && this.value.length > value)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (message != '') ? message : messages[this.lang].MAX_LENGTH_FN(length)
            }
        }
        return this;
    }

    maxNumber(value, message = '') {
        if ((utils.isNumber(this.value) && this.value > value)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (message != '') ? message : messages[this.lang].MAX_NUMBER_FN(value)
            }
        }
        return this;
    }

    minNumber(value, message = '') {
        if ((utils.isNumber(this.value) && this.value < value)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (message != '') ? message : messages[this.lang].MIN_NUMBER_FN(value)
            }
        }
        return this;
    }

    //array or object of values
    disallow(values, message = '') {
        if (this.value || this.value === 0 || this.value === false) {
            let match = false;
            for (let value in values) {
                if (this.value == values[value]) {
                    match = true;
                    break;
                }
            }
            if (match == true) {
                if (typeof this.validation.details[this.key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[this.key] = (message != '') ? message : messages[this.lang].DISALLOW_FN(this.value);
                }
            }
        }

        return this;
    }

    allow(values, message = '') {
        if ((this.value || this.value === 0 || this.value === false)) {
            let match = false;
            for (let value in values) {
                if (this.value == values[value]) {
                    match = true;
                    break;
                }
            }
            if (!match) {
                if (typeof this.validation.details[this.key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[this.key] = (message != '') ? message : messages[this.lang].DISALLOW_FN(this.value);
                }
            }
        }
        return this;
    }

    sameAs(key, message = '') {
        let _name = key.charAt(0).toUpperCase() + key.slice(1)
        let name = _name.replace('_', ' ');
        if (this.Request.body[key] !== 0) {
            if ((!this.Request.body[key])) {
                if (typeof this.validation.details[key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[key] = (message != '') ? message : this.field_name + ' ' + messages[this.lang]['FIELD_REQUIRED']
                }
                return this;
            }
        }

        if (this.value !== this.Request.body[key]) {
            this.validation.error = this.validation.error + 1;
            this.validation.details[this.key] = (message != '') ? message : messages[this.lang]['CONFIRM_PASSWORD_NOT_MATCH'];
        }
        return this;
    }

    /**
     * 
     * @param function callback 
     * @param string custom_message 
     * @returns instance
     */
    custom(callback, message = '') {
        if (callback.toString().includes('async')) {
            throw ('custom function should not be asynchronous')
        }
        let res = callback();
        if (!res) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (message != '') ? message : messages[this.lang]['DATA_SHOULD_BE_VALID'];
            }
        }
        return this;
    }

    format(type, format, custom_message = "") {
        let is_valid = true;
        if (type == 'array_obj') {
            try {
                this.value = (!Array.isArray(this.value)) ? JSON.parse(this.value) : this.value;
                if (Array.isArray(this.value)) {
                    for (let value of this.value) {
                        for (let k in format[0]) {
                            is_valid = isValidDataType(value[k], format[0][k]);
                            if (!is_valid) break;
                        }
                        if (!is_valid) break;
                    }
                } else is_valid = false;
            } catch (e) {
                console.log(e)
                is_valid = false;
            }
        }
        if (!is_valid) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                let type_name = type;
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (custom_message != '') ? custom_message : messages[this.lang].DATA_FORMAT_INVALID_FN(JSON.stringify(format))
            }
        }
        return this;
    }

    val() {
        let val = this.value;

        this.value = '';
        this.key = '';
        this.typeOfValue = '';
        this.isRequired = false;
        return val;
    }

    /**
     * Validate request data
     * @returns {boolean}
     */
    validate(redirect = true) {
        let vs = { ...this.validation };
        let resp = {
            result_code: 1,
            time: moment().tz(Config.timezone).format('YYYY-MM-DD H:m:ss'),
            error: {}
        };
        if (vs.error > 0) {
            if (this.Request.xhr || this.Request.originalUrl.includes('/api/')) {
                resp.error.title = 'Invalid Request Data';
                let message = '';
                let count = 1;
                for (let key in vs.details) {
                    if (count == 1) message += key;
                    else message += ", " + key;
                    count++;
                }
                resp.error.message = message + " " + ((count == 2) ? "is" : 'are') + ' invalid';
                resp.error.details = vs.details;
                if (redirect) {
                    this.Response.status(400).send(resp);
                    if (logger) {
                        try {
                            logger.log({
                                level: 'error', label: vs.error_code, data: resp.error, request_id: this.Request.request_id
                            })
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    return false;
                }
                else return resp.error;
            } else {
                let errors = {};
                for (let k in vs.details) {
                    errors[k] = vs.details[k];
                }
                this.Request.flash('errors', errors);
                this.Request.flash('old', this.Request.body);
                if (redirect) {
                    this.Response.redirect(this.Request.header('Referer') || '/');
                    return false;
                }
                else return errors;
            }
        } else {
            return true;
        }
    }
}
