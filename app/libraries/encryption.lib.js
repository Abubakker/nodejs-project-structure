const CryptoJS = require('crypto-js');
let DEFAULT_AES_ENC_KEY = process.env.AES_ENC_KEY || 'MSAOHLFUZ'
exports.encrypt = (text, private_key = DEFAULT_AES_ENC_KEY) => {
    var ciphertext = CryptoJS.AES.encrypt(text, private_key).toString();
    return ciphertext;
};

exports.decrypt = (ciphertext, private_key = DEFAULT_AES_ENC_KEY) => {
    let bytes = CryptoJS.AES.decrypt(ciphertext, private_key);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};