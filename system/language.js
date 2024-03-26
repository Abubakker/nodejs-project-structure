let language_digits = require('../languages/digits');
exports.convertNumber = (decimalNumber, lang = 'en') => {
    let digits = {
        en: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    }
    digits = { ...language_digits, ...digits }
    if (lang == 'en' || !digits[lang]) return decimalNumber;

    const decimalString = decimalNumber.toString();
    let banglaString = '';

    for (let i = 0; i < decimalString.length; i++) {
        const char = decimalString.charAt(i);
        const index = digits['en'].indexOf(char);

        if (index !== -1) {
            banglaString += digits[lang][index];
        } else {
            banglaString += char;
        }
    }

    return banglaString;
}