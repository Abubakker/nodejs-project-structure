require('../../loader');

let mock = {
    req: {
        connection: {
            remoteAddress: null
        },
        header: function (param) {
            if(param == 'Referer') return '/test-route'
            return param;
        },
        query: [],
        headers: { 'user-agent': 'Test Automation' },
        session: { user: { id: 1 } },
        Referer:'/test-route'
    },
    res: {
        send: function (data) {
            return data;
        },
        redirect: function (url) {
            return url
        }
    }
}
test('Should load user model', async function () {
    let file = loadModel('UserModel');
    expect(file).toBeDefined();
})
test('Should load user model', async function () {
    let file = loadModel('User');
    expect(file).toBeDefined();
})
test('Should load lib', async function () {
    let file = loadLibrary('encryption.lib');
    expect(file).toBeDefined();
})
test('Should load lib', async function () {
    let file = loadLibrary('encryption');
    expect(file).toBeDefined();
})

test('Should load a Config', async function () {
    let config = loadConfig('config');
    expect(config).toBeDefined();
})
test('Should load a App Config', async function () {
    try {
        let config = loadAppConfig();
        expect(config).toBeDefined();
    } catch (err) {
        expect(err).toBeDefined();
        expect(err?.code).toBe("MODULE_NOT_FOUND");
    }
})
test('Should load a all files', async function () {
    let files = allFilesSync('app');
    expect(files).toBeDefined();
})
test('Should load a all files tree', async function () {
    let files = dirMapTree('app');
    expect(typeof files).toBe('object');
})

test('Should load a auth middleware', async function () {
    let file = loadMiddleware('auth');
    expect(file).toBeDefined();
})

test('Should load a core controller', async function () {
    let file = loadCore('controller');
    expect(file).toBeDefined();
})

test('Should load a sytem loader file', async function () {
    let file = loadSystem('loader');
    expect(file).toBeDefined();
})

test('Should load a validator file', async function () {
    let file = loadValidator();
    expect(file).toBeDefined();
})
test('Should load a current date time', async function () {
    global.moment = require('moment-timezone')
    global.Config = loadConfig('config')
    let datetime = currentDateTime();
    expect(datetime).toMatch(/^([1-2][0-9]{3})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/);
})

test('Should load a current date', async function () {
    global.moment = require('moment-timezone')
    global.Config = loadConfig('config')
    let datetime = currentDate();
    expect(datetime).toMatch(/^\d{4}-\d{2}-\d{2}$/);
})

test('Should load a controller', async function () {
    let file = controller('user/notFound');
    expect(file).toBeDefined();
})

test('Should load a redirect route', async function () {
    let redirect = back(mock.req, mock.res);
    expect(redirect).toBe('/test-route');
})
