const express = require('express');
const route = express.Router();
exports.routes = route;
const auth = loadMiddleware('auth');
exports.prefix = '/';

/**
 * write routes here
*/

route.get('/',controller('home/index'));
