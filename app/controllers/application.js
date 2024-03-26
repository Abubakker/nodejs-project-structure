const Controller = loadCore('controller');
module.exports = class collection extends Controller {

    constructor() {
        super();
    }
    async getApplicationStatus(Req, Res) {
        try {
            let { client_type, client_version } = Req.query;
            if (!client_type || (client_type != 1 && client_type != 2)) ApiErrorResponse(Res, 'INVALID_CLIENT_TYPE');
            let app_status = loadAppConfig(),
                client_status = { ...app_status[Constants.client_types[client_type]] };

            console.log(client_status.pre_prod_version, client_version)
            if (client_status.pre_prod_version == client_version) client_status.current_version = client_status.pre_prod_version;

            delete client_status.base_url;
            delete client_status.API_KEY;
            delete client_status.pre_prod_version;

            return ApiResponse(Res, client_status)
        }
        catch (error) {
            console.log(error);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async getApplicationBaseUrl(Req, Res) {
        try {
            let { client_type, client_version } = Req.query;
            if (!client_type || (client_type != 1 && client_type != 2)) return ApiErrorResponse(Res, 'INVALID_CLIENT_TYPE');
            if (!client_version || !isInteger(client_version)) return ApiErrorResponse(Res, 'INVALID_CLIENT_VERSION');
            let app_config = loadAppConfig(),
                base = app_config[Constants.client_types[client_type]]?.base_url;
            let base_url = base[client_version]
            if (!base_url) return ApiErrorResponse(Res, 'UNSUPPORTED_VERSION');
            return ApiResponse(Res, { base_url })
        }
        catch (error) {
            console.log(error);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
}