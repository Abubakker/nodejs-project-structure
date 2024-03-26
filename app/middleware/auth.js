let jwt = require('jsonwebtoken');
module.exports = async function (req, res, next) {
    let accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    let token = null;

    if (req.header('authorization')) {
        let authorization = req.header('authorization').split(" ");
        let bearer = authorization[0];
        if (bearer === "Bearer") {
            res.header('X-Token-Filed', 'Authorization');
            token = authorization[1];
        } else {
            return ApiErrorResponse(res, 'AUTH_FAILURE', 'Authorization key is invalid format');
        }
    }
    else if (req.header('auth-token')) {
        res.header('X-Token-Filed', 'Header auth-token');
        token = req.header('auth-token');
    }
    else if (req.body['auth-token']) {
        res.header('X-Token-Filed', 'Body auth-token');
        token = req.body['auth-token'];
    }
    else {
        res.header('X-Token-Filed', 'None');
    }

    if (!token) {
        res.header('X-Auth-Fail', 'Token not given');
        return ApiErrorResponse(res, 'AUTH_FAILURE', 'Token not provided');
    }

    try {
        let payload = jwt.verify(token, accessTokenSecret);
        let user_token_id = await dataBaseTokenValidity(token);
        if (!user_token_id) return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your token is invalid');
        req.user = { ...payload, token_id: user_token_id };
        if (req.log_request_id) {
            try {
                loadModel('LogModel').updateRequestLog(req.log_request_id, { user_id: req.user.id });
            } catch (err) {
                console.log(err)
            }
        }
        next();
    }
    catch (error) {
        let { message } = error;
        res.header('X-Auth-Fail', 'Token verification failed');
        return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided token is expired');
    }
};

async function dataBaseTokenValidity(token) {
    {
        let UserModel = loadModel("UserModel");
        let data = await UserModel.tokenCheckFromDb(token);
        if (!data) return false;
        return data.id;
    }
}