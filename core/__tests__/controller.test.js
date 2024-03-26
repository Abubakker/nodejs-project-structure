let { mock } = require('../../system/test-configs')
let Core = require('../controller');
let core = new Core();

test('Page title should be default', async function () {
    let title = core.data.page_title;
    expect(title).toBe('NodeJs-Boilerplate');
})
test('Should render a controller view file', async function () {
    let res = core.notFound(mock.req, mock.res);
    expect(res).toBe('errors/404');
})
test('Should res a controller 404 json', async function () {
    mock.req.xhr = true;
    let res = core.notFound(mock.req, mock.res);
    expect(res?.error_code).toBe('NOT_FOUND');
})