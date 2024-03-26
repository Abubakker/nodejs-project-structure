const express = require('express');
const route = express.Router();
exports.routes = route;

exports.prefix = '/'
/*
 @write your routes blow:
*/

//Example: route.all('/route/:string', middleware,controller('controller/method'));

route.get('/console',controller('home/console'));

