const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres_user',
    host: 'postgres',
    database: 'mydatabase',
    password: 'postgres_password',
    port: 5432,
});

module.exports = pool;