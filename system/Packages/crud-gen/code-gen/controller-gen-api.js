const sanitize = (str) => {
    str = str.replace(/-|_/g, ' ')
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
module.exports = (controller_name, model_name, model_path, fields) => {
    let { validator_type_converter } = require('../utils'),
        field_data = '{';

    for (let field of fields) {
        let field_arr = field.split(":");
        let field_type = field_arr[1] || 'string';
        if (validator_type_converter[field_type]) field_type = validator_type_converter[field_type];
        if (field_data.includes('RequestData')) field_data += ','
        field_data += `
                    ${field_arr[0]}: RequestData.post('${field_arr[0]}', true, '${sanitize(field_arr[0])}').type('${field_type}').val()`
    }
    field_data += `
                }`

    return `const Controller = loadCore('controller');;
module.exports = class ${controller_name} extends Controller {

    constructor() {
        super();
    }
    async index(Req, Res) {
        try {
            let { page, limit } = Req.query;
            limit = parseInt(limit) || 10;
            let page_no = page ? parseInt(page) : 1;
            let offset = (page_no - 1) * limit;
            offset = offset < 0 ? 0 : offset;

            let ${model_name} = loadModel('${model_path}');
            let query_builder = ${model_name}.qb();

            let qb = query_builder.clone();
            let rows = await query_builder
                .limit(limit)
                .offset(offset)
            let total_rows = await qb.count(${model_name}.table + '.id', { as: 'total' }).first();
            
            let total = total_rows.total || 0;
            return ApiResponse(Res, { total, page_no, limit, rows })
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async save(Req, Res) {
        try {
            let RequestData = loadValidator(Req, Res),
                insert_data = ${field_data}
            if (!RequestData.validate()) return false;

            let ${model_name} = loadModel('${model_path}');
            let insert_id = await ${model_name}.save(insert_data)

            return ApiResponse(Res, { message: 'SUCCESS', id: insert_id })

        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async show(Req, Res) {
        try {
            let { id } = Req.params;
            let ${model_name} = loadModel('${model_path}');
            let row = await ${model_name}.find({ id })
            if (row) return ApiResponse(Res, row)
            else return ApiResponse(Res, {})
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async update(Req, Res) {
        try {
            let { id } = Req.params;
            let RequestData = loadValidator(Req, Res),
                update_data = ${field_data}
            if (!RequestData.validate()) return false;

            let ${model_name} = loadModel('${model_path}');
            let updated_res = await ${model_name}.update({ id }, update_data)

            if (updated_res) return ApiResponse(Res, { message: 'SUCCESS', id })
            else ApiErrorResponse(Res, 'DATA_NOT_FOUND');
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }
    async delete(Req, Res) {
        try {
            let { id } = Req.params;
            let ${model_name} = loadModel('${model_path}');
            let res = await ${model_name}.delete({id})
            if (res) return ApiResponse(Res, { message: 'SUCCESS', id })
            else ApiErrorResponse(Res, 'DATA_NOT_FOUND');
        } catch (err) {
            console.log(err)
            ApiErrorResponse(Res, 'SOMETHING_WENT_WRONG');
        }
    }

}

`;

}