process.env.AES_ENC_KEY = 6087652191;
test('should encrypt data',async function() {
    let lib = require('../encryption.lib');
    let encrypted = lib.encrypt('test data')
    expect(encrypted).toBeDefined();
})
test('should decrypt previous data',async function() {
    let lib = require('../encryption.lib');
    let plain_text = 'test data';
    let encrypted = lib.encrypt(plain_text);
    let decrypted = lib.decrypt(encrypted);
    expect(decrypted).toEqual(plain_text);
})