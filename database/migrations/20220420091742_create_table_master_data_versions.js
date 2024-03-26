
exports.up = function(knex) {
    return knex.schema.createTable('master_data_versions', function (table) {
       table.increments('id');
       table.string('table_name', 50).notNullable();
       table.tinyint('type', 1).notNullable().comment('1= db tables, 2= static');
       table.integer('version', 10).notNullable().default(1);
       table.longtext('json').nullable();
       table.text('settings', 255).nullable();
       table.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("master_data_versions")
};
