const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ueyfs6ewljzn9vet5ckj',
  host: 'bm1id4atulqm95t8genz-postgresql.services.clever-cloud.com',
  database: 'bm1id4atulqm95t8genz',
  password: '13yCZqNk1k52I4TdGajS',
  port: 5432,
})

module.exports = pool;