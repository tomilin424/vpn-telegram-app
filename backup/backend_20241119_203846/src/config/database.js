require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    use_env_variable: 'POSTGRES_URL',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    dialect: 'postgres',
    use_env_variable: 'POSTGRES_URL',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}; 