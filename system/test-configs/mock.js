let mock = {
    req: {
        connection: {
            remoteAddress: null
        },
        header: function (param) {
            if (param == 'Referer') return '/test-route'
            return param;
        },
        body: {
            sample: 'sample-data',
            sample_int: 100,
            sample_zero:0,
        },
        query: { sample: 'sample-data' },
        params: { sample: 'sample-data' },
        headers: { 'user-agent': 'Test Automation' },
        session: { user: { id: 1 } },
        Referer: '/test-route',
        xhr: false,
        originalUrl: '/',
        falsh_data: {},
        flash: function (key, value) {
            if (value == undefined) return this.falsh_data[key]
            this.falsh_data[key] = value;
        }
    },
    res: {
        send: function (data) {
            return data;
        },
        redirect: function (url) {
            return url
        },
        render: function (prm) {
            return prm
        },
        status: function (code) {
            return this;
        }
    }
}

module.exports = {
    mock
}