const express = require('express');
const route = express.Router();
exports.routes = route;

/*
 @write your routes blow:
 using role: route.method('route path',controller(folder(if any)/controllerName/method))
 NB: no need folder if no folder added into controllers folder.
 NB: write controllerName without Controller and .js.
*/
exports.prefix = 'api/v1';

//System API
route.get('/get-application-status', controller('application/getApplicationStatus'));
route.get('/get-application-base-url', controller('application/getApplicationBaseUrl'));

route.get('/get-master-data-versions', controller('master_data/getMasterDataVersions'));
route.get('/get-master-data', controller('master_data/getMasterData'));
