/*
 @Purpose: Database setting information
*/

/*
 @Purpose: use driver name like mysql or false without database
*/

const configurations = {
  sqlite: {
    filename: "./database/" + process.env.DB_NAME || "db.sqlite"
  },
  mysql: {
    host: (process.env.DB_HOST) ? process.env.DB_HOST : '127.0.0.1',
    user: (process.env.DB_USER) ? process.env.DB_USER : '',
    password: (process.env.DB_PASSWORD) ? process.env.DB_PASSWORD : '',
    database: (process.env.DB_NAME) ? process.env.DB_NAME : ''
  }
}
const config_db = {
  ...configurations[process.env.DB || 'mysql'],
  typeCast: function (field, next) {
    if (!moment) var moment = require('moment-timezone');
    if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
      let value = field.string();
      if (!value) return value;
      if (Config.db_datetime_convert) return moment(value).tz(Config.timezone).format('YYYY-MM-DD HH:mm:ss');
      else return new Date(value).valueOf();
    } else if (field.type == 'DATE') {
      let value = field.string();
      if (!value) return value;
      return new Date(value).valueOf();
    }
    return next();
  }
};
exports.config_db = config_db;
exports.conf_knex = configurations;
if (process.env.USE_DB == 'true') {
  let instance;
  if (process.env.DB == 'sqlite') {
    instance = require('knex')({
      client: 'sqlite3',
      connection: configurations[process.env.DB],
      useNullAsDefault: true
    });
  } else if (process.env.DB == 'mysql') {
    instance = require('knex')({
      client: 'mysql',
      connection: config_db
    });
  } else console.log('Please set proper database name in the env.DB')

  exports.instance = instance;
}