
exports.up = function (knex) {
    return knex.schema.createTable('user_tokens', function (table) {
        table.increments('id');
        table.integer('user_id').notNullable();
        table.string('access_token', 512).notNullable();
        table.string('refresh_token', 512).notNullable();
        table.string('user_agent', 512).nullable();
        table.string('ip', 256).nullable();
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("user_tokens")
};
