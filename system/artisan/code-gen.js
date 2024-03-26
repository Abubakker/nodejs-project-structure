exports.getControllerCodes = (n) => `const Controller = loadCore('controller');;
module.exports = class ${n} extends Controller {

    constructor() {
        super();
    }
}
`;

exports.getModelCodes = (n, table = "") => `const Model = loadCore('model');

module.exports = class ${n} extends Model {
    constructor() {
        super();
        this.table = '${table}';
        this.primaryKey = 'id';
    }
}
`;
exports.getMiddlewareCodes = () => `module.exports = (req, res, next) => {
    next();
};
`;

exports.getLibraryCodes = () => `module.exports = () => {
    return true;
};
`;

// Get Migration Code start
exports.getMigrationCodes = (table_name, fields = {}, target_action = 'create') => {
    if (fields[0]?.includes('-')) fields = ["column_name"];
    else if (target_action != 'create' && (fields.length == 0 || !Array.isArray(fields))) fields = ["column_name"];
    let action = 'createTable';
    let action2 = 'dropTable';
    let up = 'up';
    let down = 'down';

    if (target_action == 'add_column') {
        action = 'table';
        action2 = 'dropColumn'
    }
    if (target_action == 'alter') {
        action = 'alterTable';
        action2 = 'alterTable'
    }
    if (target_action == 'drop') {
        up = 'down';
        down = 'up';
    }
    if (target_action == 'remove_column') {
        up = 'down';
        down = 'up';
        action = 'table';
        action2 = 'dropColumn'
    }
    if (Object.keys(fields).length != 0) {
        let codes = { up: "", down: "" }
        codes.up = `exports.${up} = function (knex) {
    return knex.schema.${action}('${table_name || ""}', function (table) {`
        if (action == 'createTable') codes.up += `
        table.increments('id');`;
        for (let k in fields) {
            let field = fields[k].split(':');
            if (field[1] == 'int') field[1] = 'integer';
            if (field[1] == 'varchar') field[1] = 'string';

            codes.up += `
        table.${field[1] || 'string'}('${field[0]}').nullable();`
        }

        if (action == 'createTable') codes.up += `
        table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
        table.dateTime('updated_at').nullable();`;
        codes.up += `
    })
};
`
        codes.down += `exports.${down} = function (knex) {
    `;
        if (action == 'createTable') codes.down += `return knex.schema.dropTable('${table_name || ""}')`;
        else if (action2 == 'dropColumn') {
            codes.down += `return knex.schema.table("${table_name || ""}", (table) => {
        `;
            for (let k in fields) {
                let field = fields[k].split(':');
                if (k != 0) codes.down += `
        `
                codes.down += `table.dropColumn("${field[0]}");`;
            }
            codes.down += `
    })`
        } else if (action2 == 'alterTable') {
            codes.down += `return knex.schema.alterTable("${table_name || ""}", (table) => {
        `;
            for (let k in fields) {
                let field = fields[k].split(':');
                if (field[1] == 'int') field[1] = 'integer';
                if (field[1] == 'varchar') field[1] = 'string';
                if (k != 0) codes.down += `
        `
                codes.down += `table.${field[1] || 'string'}('${field[0]}').nullable();`
            }
            codes.down += `
    })`
        }
        codes.down += `
};
`
        return codes[up] + codes[down];
    } else {
        let codes = {
            up: "",
            down: ""
        }
        codes.up = `
exports.${up} = function (knex) {
    return knex.schema.${action}('${table_name || ""}', function (table) {
        `
        if (action == 'createTable') codes.up += `table.increments('id');
        
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    `;
        codes.up += `})
};
`

        codes.down = `exports.${down} = function (knex) {
    return knex.schema.${action2}('${(action == 'createTable') ? table_name : ""}')
};
`
        return codes[up] + codes[down];
    }
}
// Get Migration Code End