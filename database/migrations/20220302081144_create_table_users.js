
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id');
        table.string('first_name', 255).notNullable();
        table.string('last_name', 255).notNullable();
        table.string('email', 255).unique();
        table.string('password', 255).notNullable();
        table.string('reset_password').nullable();
        table.dateTime('reset_password_at').nullable();
        table.string('uuid').nullable();
        table.tinyint('status').defaultTo(1);
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("users")
};
