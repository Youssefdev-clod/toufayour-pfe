const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    encrypt: false,              // مهم
    trustServerCertificate: true // مهم (بحال SSMS)
  },
};

let pool;

async function connectDB() {
  if (pool) return pool;
  pool = await sql.connect(config);
  console.log("✅ SQL Server connected");
  return pool;
}

async function query(text, params = {}) {
  const pool = await connectDB();
  const request = pool.request();

  for (const key in params) {
    request.input(key, params[key]);
  }

  return request.query(text);
}

module.exports = { sql, connectDB, query };
