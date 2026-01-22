const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // 127.0.0.1
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function connectDB() {
  if (pool) return pool;
  pool = await sql.connect(config);
  console.log("✅ SQL Server connected");
  return pool;
}

module.exports = { sql, connectDB };
