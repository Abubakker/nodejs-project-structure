const Controller = loadCore('controller');
module.exports = class notification extends Controller {

    constructor() {
        super();
    }

    /**
     * Deposit Entry Form Submit API
     * @param Req
     * @param Res
     * @returns {Promise<boolean|void>}
     */
    async registerNotificationToken(Req, Res) {
        try {
            /** Load Validator */
            let RequestData = loadValidator(Req, Res);

            let receiveData = {
                token: RequestData.post('token', true).type('string').minLength(100).val(),
            }
            let { client_type } = Req.query;
            if (!client_type || !Config.allowed_clients.includes(parseInt(client_type))) return ApiErrorResponse(Res, 'INVALID_CLIENT_TYPE');

            // Check data validity
            if (!RequestData.validate()) return false;
            receiveData.user_id = Req.user.id;
            receiveData.client_type = client_type;

            let NotificationTokenModel = loadModel('NotificationTokenModel');
            let del_res = await NotificationTokenModel.delete({ user_id: Req.user.id })
            let id = await NotificationTokenModel.save(receiveData);

            // return API Response
            return ApiResponse(Res, { message: 'SUCCESS', id: id })
        } catch (err) {
            console.log(err);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    /**
     * 
     * @param RequestObject Req 
     * @param RequestObject Res 
     */
    async sendTestNotification(Req, Res) {
        try {
            let { client_type } = Req.query;
            if (!client_type || !Config.allowed_clients.includes(parseInt(client_type))) return ApiErrorResponse(Res, 'INVALID_CLIENT_TYPE');

            let RequestData = loadValidator(Req, Res),
                token = RequestData.post('token', true).type('string').minLength(100).val();
            if (!RequestData.validate()) return false;

            let notification = loadLibrary('notification'),
                res = await notification.pushSend(
                    { client_type, token },
                    'test title',
                    'test message',
                    {
                        type: 1, // feature name
                        flag:1000, // Open UI depends on flag
                        status_code: 1,
                        element_id: null
                    }
                );
            return ApiResponse(Res, JSON.parse(res))
        } catch (err) {
            console.log(err);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }

    }

}


