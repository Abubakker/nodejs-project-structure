
const db_connection = () => {
  if (process.env.USE_DB == 'true') {
    let { config_db } = require('../config/database');

    let instance = require('knex')({
      client: (process.env.DB == 'sqlite') ? 'sqlite3' : 'mysql',
      connection: config_db,
      useNullAsDefault: true
    });
    instance.raw('select 1+1 as result').catch(err => {
      console.log(`${err}`)
    });
  } else {
    console.log('No database configuration to use')
  }
}

exports.validate = () => {
  db_connection()
}