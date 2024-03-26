const express = require('express');
const route = express.Router();
exports.routes = route;
/*
 @write your routes blow:
 using role: route.method('route path',controller(folder(if any)/controllerName/method))
 NB: no need folder if no folder added into controllers folder.
 NB: write controllerName without Controller and .js.
*/
exports.prefix = 'api/v1/test';
route.post('/send-test-notification', controller('notification/sendTestNotification'));
route.get('/console',controller('home/console'));
