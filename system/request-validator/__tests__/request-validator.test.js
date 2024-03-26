let Request = require("../index");
let { mock } = require("../../test-configs")
global.Config = require('../../../config/config');
global.moment = require('moment-timezone');



test('should get the get data', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.get('sample');
    expect(sample).toBe("sample-data");
})
test('should get the get query data', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.params('sample');
    expect(sample).toBe("sample-data");
})

test('should get the post required data', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).val();
    expect(sample).toBe("sample-data");
})
test('should get the post data(not required)', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample').val();
    expect(sample).toBe("sample-data");
})

test('should get the post data(not required)', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_zero').val();
    expect(sample).toBe(0);
})

// type
test('should get the post string data(not required)', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.body('sample').type('string').val();
    expect(sample).toBe("sample-data");
})
test('should get undefined key of the post data', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('undefined_key', true).type('int').val();
    expect(sample).toBeUndefined();
})
test('should get undefined key of the post data with custom name and message', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('undefined_key', true, 'sample2', 'Data Not Found').type('int').val();
    expect(sample).toBeUndefined();
})

test('should redirect to /test-route', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).type('int', 'Data should be integer').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

test('should get the validation errors', async function () {
    let req2 = { ...mock.req }
    req2.xhr = true;
    let RequestDataApi = new Request(req2, mock.res);

    let sample = RequestDataApi.post('sample', true).type('int').val();
    let errors = RequestDataApi.validate()
    expect(errors).toBe(false);
})

test('should redirect to /test-route [invalid bool type]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).type('bool').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid float type]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).type('float').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid array_int type]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', false).type('array_int').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

test('should redirect to /test-route [invalid date type]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', false).type('date').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

test('should redirect to /test-route [invalid date type]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', false).type('date').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid date type] with previous invalid validation', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', false).minLength(100).type('date').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

// length
test('should redirect to /test-route [invalid length of data]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', false).length(10).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid length of data] with custom message', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', false).length(10,'Invalid length').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid length of data] with invalid previous validation', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', false).type('int').length(10).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

test('should redirect to /test-route [invalid length of data] with invalid type', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', false).length(10).val();
    let rdrct = RequestData.validate()
    expect(sample).toBe(100);
})
test('should redirect to /test-route [invalid length of data] with required', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).length(1).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

// min length
test('should redirect to /test-route [invalid min length of string]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).minLength(50).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should validate min length of string input', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).minLength(1).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(true)
})
test('should redirect to /test-route [invalid min length of data with custom msg]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).minLength(50,'minimum length 1 is required').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid min length of data with previous method invalid ]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).type('int').minLength(50).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

// max length
test('should redirect to /test-route [invalid max length of string]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).maxLength(1).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should validate max length of string input', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).maxLength(100).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(true)
})
test('should redirect to /test-route [invalid max length of data with custom msg]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).maxLength(1,'max length 1 is required').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid max length of data with previous method invalid ]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample', true).type('int').maxLength(1).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

// max number
test('should redirect to /test-route [invalid max number]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).maxNumber(10).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should validate max number', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).maxNumber(1000).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(true)
})
test('should redirect to /test-route [invalid max number of data with custom msg]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).maxNumber(10,'max number 10 is required').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid max number of data with previous method invalid ]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).type('string').maxNumber(1).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

// min number
test('should redirect to /test-route [invalid min number]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).minNumber(101).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should validate min number', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).minNumber(1).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(true)
})
test('should redirect to /test-route [invalid min number of data with custom msg]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).minNumber(101,'min number 101 is required').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid min number of data with previous method invalid ]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).type('string').minNumber(101).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})

//disallow
test('should redirect to /test-route [invalid disallow number]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).disallow([100]).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should validate disallow method', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).disallow(1).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(true)
})
test('should redirect to /test-route [invalid by disallow method with custom msg]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_int', true).disallow([100],'100 is not allowed').val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})
test('should redirect to /test-route [invalid by disallow method with previous method invalid ]', async function () {
    let RequestData = new Request(mock.req, mock.res);
    let sample = RequestData.post('sample_zero', true).type('string').disallow([0]).val();
    let rdrct = RequestData.validate()
    expect(rdrct).toBe(false);
})