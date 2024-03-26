// Update with your config settings.
let dotEnv = require("dotenv");
let path = require("path");
dotEnv.config();
const { conf_knex } = require('./config/database')
let knexConfig = {};
knexConfig[process.env.NODE_ENV] = {
    client: (process.env.DB == 'sqlite') ? 'sqlite3' : 'mysql',
    connection: conf_knex[process.env.DB],
    useNullAsDefault: true,
    migrations: {
        directory: path.join(__dirname, "/database/migrations"),
        tableName: 'migrations'
    },
    seeds: {
        directory: path.join(__dirname, "database/seeds/"),
    }
};
module.exports = knexConfig;
