let { mock } = require('../../system/test-configs')
let Model = require('../model');
process.env.USE_DB = true;
let model = new Model();

test('Page title should be default', async function () {
    expect(model).toBeDefined();
})