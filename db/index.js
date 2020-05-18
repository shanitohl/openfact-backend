const { Pool } = require('pg')
//Conection BDOrigen
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '192.168.1.18',
  // host: process.env.DB_HOST || '192.168.1.38',
  database: process.env.DB_DATA_BASE ||'openfact',//'openfactoldinptah',//'postgres' ,//'openfact',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 5432//54321//5431
})

module.exports = {
  // query: (text, params, callback) => {
  //   const start = Date.now()
  //   return pool.query(text, params, (err, res) => {
  //     const duration = Date.now() - start
  //     console.log('executed query', { text, duration, rows: res.rowCount })
  //     callback(err, res)
  //   })
  // }

  query: (text, params) => pool.query(text, params)
}