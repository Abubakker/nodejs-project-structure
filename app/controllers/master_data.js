const Controller = loadCore('controller');
module.exports = class master_data extends Controller {

    constructor() {
        super();
    }
    async getMasterDataVersions(Req, Res) {
        try {
            let MasterDataModel = loadModel('MasterDataModel')
            let rows = await MasterDataModel.db(MasterDataModel.table).select(['table_name', 'version'])

            return ApiResponse(Res, rows)
        }
        catch (error) {
            console.log(error);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async getMasterData(Req, Res) {
        try {
            let MasterDataModel = loadModel('MasterDataModel')
            let tableWhereIn = [];
            let { data } = Req.query;
            if (data) {
                let data_array = data.split(',')
                for (let table of data_array) {
                    tableWhereIn.push(table);
                }
            }

            let rows;
            if (tableWhereIn.length > 0) rows = await MasterDataModel.db(MasterDataModel.table).whereIn('table_name', tableWhereIn).select(MasterDataModel.select);
            else rows = await MasterDataModel.db(MasterDataModel.table).select(['table_name', 'version'])
            if (data) {
                rows = rows.map((row) => {
                    return {
                        ...row,
                        json: JSON.parse(row.json)
                    }
                })
            }
            return ApiResponse(Res, rows)
        }
        catch (error) {
            console.log(error);
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }

}
