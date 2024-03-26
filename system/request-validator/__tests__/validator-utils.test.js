let validator = require('../utils/validate-data-type')
test('Should be int', async function () {
    let is_valid = validator.isValidDataType(1, 'int');
    expect(is_valid).toBeTruthy();
})
test('Should not be int', async function () {
    let is_valid = validator.isValidDataType('String Data', 'int');
    expect(is_valid).toBeFalsy();
})

test('should be bool', async function () {
    let is_valid = validator.isValidDataType("true", 'bool');
    expect(is_valid).toBeTruthy();
})
test('should be bool', async function () {
    let is_valid = validator.isValidDataType(true, 'bool');
    expect(is_valid).toBeTruthy();
})
test('should not be bool', async function () {
    let is_valid = validator.isValidDataType("10", 'bool');
    expect(is_valid).toBeFalsy();
})

test('should be number', async function () {
    let is_valid = validator.isValidDataType(10, 'number');
    expect(is_valid).toBeTruthy();
})
test('should not be number', async function () {
    let is_valid = validator.isValidDataType('data', 'number');
    expect(is_valid).toBeFalsy();
})

test('should be email', async function () {
    let is_valid = validator.isValidDataType('sample@test.test', 'email');
    expect(is_valid).toBeTruthy();
})
test('should not be email', async function () {
    let is_valid = validator.isValidDataType('wrong@email', 'email');
    expect(is_valid).toBeFalsy();
})

test('should be date', async function () {
    let is_valid = validator.isValidDataType('2022-01-01', 'date');
    expect(is_valid).toBeTruthy();
})
test('should not be date', async function () {
    let is_valid = validator.isValidDataType('0000-00-00', 'date');
    expect(is_valid).toBeFalsy();
})
test('should not be date', async function () {
    let is_valid = validator.isValidDataType('2022', 'date');
    expect(is_valid).toBeFalsy();
})

test('should be valid bd mobile', async function () {
    let is_valid = validator.isValidDataType('01912567806', 'mobile_bd');
    expect(is_valid).toBeTruthy();
})
test('should not be valid bd mobile', async function () {
    let is_valid = validator.isValidDataType('0191256', 'mobile_bd');
    expect(is_valid).toBeFalsy();
})

test('should be float number', async function () {
    let is_valid = validator.isValidDataType('10.00', 'float');
    expect(is_valid).toBeTruthy();
})
test('should not be float number', async function () {
    let is_valid = validator.isValidDataType('value', 'float');
    expect(is_valid).toBeFalsy();
})

test('should be array of int', async function () {
    let is_valid = validator.isValidDataType('[1,2,3]', 'array_int');
    expect(is_valid).toBeTruthy();
})
test('should not be array of int', async function () {
    let is_valid = validator.isValidDataType('["a",2,3]', 'array_int');
    expect(is_valid).toBeFalsy();
})
test('should not be array of int', async function () {
    let is_valid = validator.isValidDataType([1, 2], 'array_int');
    expect(is_valid).toBeTruthy();
})
test('should not be array of int', async function () {
    let is_valid = validator.isValidDataType([], 'array_int', true);
    expect(is_valid).toBeFalsy();
})
test('should not be array of int', async function () {
    let is_valid = validator.isValidDataType('{"one":1}', 'array_int');
    expect(is_valid).toBeFalsy();
})
test('should not be array of int', async function () {
    let is_valid = validator.isValidDataType('invalid data', 'array_int');
    expect(is_valid).toBeFalsy();
})
test('should not be valid data', async function () {
    let is_valid = validator.isValidDataType('invalid data', 'phone');
    expect(is_valid).toBeFalsy();
})