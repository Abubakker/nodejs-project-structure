module.exports = async function (req, res, next) {
    try {
        if(process.env.NODE_ENV=='development') next()
        else return ApiErrorResponse(res, 'FEATURE_NOT_AVAILABLE');
    }
    catch (err) {
        console.log(err)
        next();
    }
};
