module.exports = (app) => {
    let { allRoutes } = require('./autoload');
    for (let key in allRoutes) {
        if (process.env.NODE_ENV != 'development' && (key == 'dev' || key == 'development')) continue;
        let route = allRoutes[key];
        if (route.prefix == '' || route.prefix == '/' || route.prefix == undefined) app.use('/', route.routes);
        else app.use('/' + route.prefix, route.routes);
    }
    //Didn't match any route then it'll be executed
    app.use(function (req, res) {
        try {
            let paths = req.path.split('/');
            let method = paths[paths.length - 1];
            paths.pop();
            let controller_path = paths.join('/');
            try {
                let Controller = require('../app/controllers' + controller_path),
                    controller = new Controller();
                controller[method](req, res);
            } catch (err) {
                if (process.env.LOG_LEVEL == 'debug' || process.env.LOG_LEVEL == 'silly') console.error('\033[31m404:Route not found! \x1b[0m"' + controller_path.replace('/', '') + '/' + method + '" not found');
                logger.log({
                    level: "debug",
                    label: "404_ROUTE_NOT_FOUND",
                    message: "'" + req.path + "' not found"
                });
                throw err;
            }
        } catch (err) {
            return ApiErrorResponse(res, 'NOT_FOUND')
        }

    });
    return app;
}