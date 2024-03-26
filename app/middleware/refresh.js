let jwt = require('jsonwebtoken');
module.exports = async function (req, res, next) {
    let refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
    let token = null;

    if (req.header('authorization')) {
        res.header('X-Token-Filed', 'Authorization');
        let authorization = req.header('authorization').split(" ");
        let bearer = authorization[0];
        // console.log(bearer);
        if (bearer === "Bearer") token = authorization[1];
    }
    else if (req.header('refresh-token')) {
        res.header('X-Token-Filed', 'Header refresh-token');
        token = req.header('refresh-token');
    }
    else if (req.body['refresh-token']) {
        res.header('X-Token-Filed', 'Body refresh-token');
        token = req.body['refresh-token'];
    }
    else {
        res.header('X-Token-Filed', " ");
    }

    if (!token) {
        res.header('X-Refresh-Token', 'Token not given');
        return ApiErrorResponse(res, 'AUTH_FAILURE', 'Token not provided');
    }

    try {
        let payload = jwt.verify(token, refreshTokenSecret);
        req.refreshToken = token;
        req.payload = payload;
        next();
    }
    catch (error) {
        res.header('X-Refresh-Token', 'Your token is invalid');
        return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your token is invalid');
    }
};