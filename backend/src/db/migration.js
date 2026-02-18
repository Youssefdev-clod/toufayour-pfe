import fs from 'fs';
import path from 'path';
import sql from 'mssql';
import 'dotenv/config';
import { createHash } from "node:crypto";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    encrypt: false,           
    trustServerCertificate: true
  },
};

async function runMigrations() {
  const pool = await sql.connect(config);
  console.log("Connected to SQL Server ✅");

    await pool.request().query(`
      IF OBJECT_ID('dbo.migrations_history', 'U') IS NULL
      BEGIN
          CREATE TABLE dbo.migrations_history (
              id INT IDENTITY(1,1) PRIMARY KEY,
              filename NVARCHAR(255) NOT NULL,
              checksum NVARCHAR(64) NOT NULL,
              applied_by NVARCHAR(255) NOT NULL,
              applied_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
          );
      END
      `);
      
    
    const migrationsDir = path.join(process.cwd(), 'src', 'db', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // run in order: 001_..., 002_...

    for (const file of files) {

      const transaction = new sql.Transaction(pool);
      const selectRequest = new sql.Request(pool);
      const filePath = path.join(migrationsDir, file);
      const sqlText = fs.readFileSync(filePath, 'utf-8');
      const checksum = createHash("sha256").update(sqlText).digest("hex");

      // Check if already applied
      const res = await selectRequest
      .input("filename", sql.NVarChar, file)
      .query("SELECT TOP 1 * FROM migrations_history WHERE filename = @filename");

      if (res.recordset.length > 0) {
        // Optional: verify checksum
        if (res.recordset[0].checksum !== checksum) {
          throw new Error(`Migration file changed after being applied: ${file}`);
        }
        console.log(`Skipping already applied migration: ${file}`);
        continue;
      }

      try {
          await transaction.begin();
        // Run Migration
        console.log(`Running migration: ${file}`);
        await new sql.Request(transaction).query(sqlText);
        const insertRequest = new sql.Request(transaction);
        // add to migration history
          await insertRequest
          .input("filename", sql.NVarChar, file)
          .input("checksum", sql.Char(64), checksum)
          .input("applied_by", sql.NVarChar, process.env.DB_USER)
          .query(`
            INSERT INTO migrations_history(filename, checksum, applied_by)
            VALUES (@filename, @checksum, @applied_by)
          `);
          await transaction.commit();
      } catch (err){
          await transaction.rollback();
          console.error("Migration failed ❌", err);
          break;
      }
    }
    await pool.close();
    console.log("All migrations ran successfully ✅");
}

runMigrations().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});