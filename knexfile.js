// Update with your config settings.

module.exports = {

  client: 'postgresql',
  // client: 'postgres',
  connection: {
    host     : process.env.APP_DB_HOST     || '127.0.0.1',
    user     : process.env.APP_DB_USER     || '',
    password : process.env.APP_DB_PASSWORD || '',
    database : process.env.APP_DB_NAME     || 'authme'
  },
  
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }

};
