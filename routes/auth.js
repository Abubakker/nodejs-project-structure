const express = require('express');
const route = express.Router();
exports.routes = route;
const auth = loadMiddleware('auth');
const refresh = loadMiddleware('refresh');

/*
 @write your routes blow:
 using role: route.method('route path',controller(folder(if any)/controllerName/method))
 NB: no need folder if no folder added into controllers folder.
 NB: write controllerName without Controller and .js.
*/
exports.prefix = 'api/v1/auth';

route.post('/check-user', controller('user/checkUser'));
route.post('/sign-up', controller('user/userRegistration'));
route.post('/login', controller('user/userLogin'));
route.post('/logout', auth, controller('user/logout'));
route.post('/refresh-token', refresh, controller('user/refreshToken'));
route.post('/check-auth-token', controller('user/checkAuthToken'));

route.post('/update-password', auth, controller('user/updatePassword'));
route.post('/update-user-info', auth, controller('user/updateUserInfo'));
route.post('/send-reset-token', controller('user/getPasswordResetToken'));
route.post('/reset-password', controller('user/resetPassword'));

//firebase register token
//route.post('/register-notification-token', auth, controller('notification/registerNotificationToken'));
