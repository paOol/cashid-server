const env = process.env.NODE_ENV || 'development';
const db = require('./config/config.js')[env];

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: `${db.connection.host}`,
      database: `${db.connection.database}`,
      port: `${db.connection.port}`,
      user: `${db.connection.user}`,
      password: `${db.connection.password}`
    },
    pool: {
      min: 2,
      max: 100
    },
    migrations: {
      tableName: 'cashid_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: `${db.connection.host}`,
      port: `${db.connection.port}`,
      database: `${db.connection.database}`,
      user: `${db.connection.user}`,
      password: `${db.connection.password}`
    },
    pool: {
      min: 2,
      max: 100
    },
    migrations: {
      tableName: 'cashid_migrations'
    }
  }
};
