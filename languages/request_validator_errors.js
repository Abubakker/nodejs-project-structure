let { convertNumber } = require('../system/language');
// all message for english language
const en = {
    "FIELD_REQUIRED": "Field is required",
    "CONFIRM_PASSWORD_NOT_MATCH": "Confirm Password didn't match",
    "INTEGER": "Data Should be an integer",
    "NUMBER": "Data Should be a number",
    "BOOLEAN": "Data Should be a boolean",
    "ARRAY_INT": "Data Should be an array of integer",
    "DATE": "Data Should be a date formatted like YYYY-MM-DD",
    "MOBILE_BD": "Data Should be 11 digits valid mobile number",
    "STRING": "Data Should be a string",
    "ARRAY": "Data Should be a array",
    "EMAIL": "Data Should be a valid email address",
    "DATA_SHOULD_BE_VALID": "Data should be valid",
    "LENGTH_FN": (length) => {
        return 'The value should be ' + length + ' characters.'
    },
    "MIN_LENGTH_FN": (length) => {
        return 'The value should be minimum of ' + length + ' characters.'
    },
    "MAX_LENGTH_FN": (length) => {
        return 'The value should be maximum of ' + length + ' characters.'
    },
    "MIN_NUMBER_FN": (length) => {
        return 'The value should be minimum of ' + length
    },
    "MAX_NUMBER_FN": (length) => {
        return 'The value should be maximum of ' + length
    },
    "DISALLOW_FN": (value) => {
        return value + ' is not allowed'
    },
    "DATA_FORMAT_INVALID_FN": (valid_format) => {
        return 'Data format should be ' + valid_format
    }
}

// all message for bangla language
const bn = {
    "FIELD_REQUIRED": "পূরণ করতে হবে",
    "CONFIRM_PASSWORD_NOT_MATCH": '"পাসওয়ার্ড নিশ্চিত করন" মেলেনি',
    "INTEGER": "একটি পূর্ণসংখ্যা হওয়া উচিত",
    "NUMBER": "সঠিক নম্বর হওয়া উচিত",
    "BOOLEAN": "বুলিয়ান হওয়া উচিত",
    "ARRAY_INT": "পূর্ণসংখ্যার অ্যারে হওয়া উচিত",
    "DATE": "তারিখ(YYYY-MM-DD) হওয়া উচিত",
    "MOBILE_BD": "11 সংখ্যার বৈধ মোবাইল নম্বর হওয়া উচিত",
    "STRING": "সঠিক স্ট্রিং হওয়া উচিত",
    "ARRAY": "সঠিক অ্যারে হওয়া উচিত",
    "EMAIL": "একটি সঠিক ইমেল এড্রেস হওয়া উচিত",
    "DATA_SHOULD_BE_VALID": "ডেটা সঠিক হতে হবে",
    "LENGTH_FN": (length) => {
        return `মান ${convertNumber(length, 'bn')} অক্ষরের হওয়া উচিত`
    },
    "MIN_LENGTH_FN": (length) => {
        return `মান ন্যূনতম ${convertNumber(length, 'bn')} অক্ষরের হওয়া উচিত`
    },
    "MAX_LENGTH_FN": (length) => {
        return `মান সর্বোচ্চ ${convertNumber(length, 'bn')} অক্ষরের হওয়া উচিত`
    },
    "MIN_NUMBER_FN": (length) => {
        return `মান ন্যূনতম ${convertNumber(length, 'bn')} হওয়া উচিত`
    },
    "MAX_NUMBER_FN": (length) => {
        return `মান সর্বোচ্চ ${convertNumber(length, 'bn')} হওয়া উচিত`
    },
    "DISALLOW_FN": (value) => {
        return convertNumber(value, 'bn') + ' অনুমোদিত নয়'
    },
    "DATA_FORMAT_INVALID_FN": (valid_format) => {
        return 'ডাটা ফরম্যাট এই ফরম্যাটের মত হওয়া উচিত ' + valid_format
    }
}
exports.messages = { en, bn }