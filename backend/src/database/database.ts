import pool from "./db_pool";
import { Pool, QueryResult } from "pg";

// here is to define the db initialization

const usersField: string =
  "id SERIAL PRIMARY KEY, username VARCHAR(32), email VARCHAR(32), password VARCHAR(255), firstname VARCHAR(32), lastname VARCHAR(32), verified BOOLEAN DEFAULT FALSE, connection_status BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";

const tokenField: string =
  "id SERIAL PRIMARY KEY, token VARCHAR(255) NOT NULL, user_id INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour'";

class Database {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async initDatabase(): Promise<boolean> {
    try {
      await this.initTable("users", usersField);
      await this.initTable("tokens", tokenField); // to complete with more tables if necessary
      return true;
    } catch (err) {
      return false;
    }
  }

  async initTable(table: string, fields: string): Promise<void> {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${table}(${fields});` // to complete with more fields
    );
  }
}

const dbInstance = new Database(pool);

export default dbInstance;
