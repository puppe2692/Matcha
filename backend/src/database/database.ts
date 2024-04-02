import pool from "./db_pool";
import { Pool } from "pg";

// here is to define the db initialization

const usersField: string =
  "id SERIAL PRIMARY KEY, username VARCHAR(32), email VARCHAR(32)";

class Database {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async initDatabase(): Promise<boolean> {
    try {
      await this.initUsersTable(); // to complete with more tables if necessary
      return true;
    } catch (err) {
      return false;
    }
  }

  async initUsersTable() {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users(${usersField});` // to complete with more fields
    );
  }
}

const dbInstance = new Database(pool);

export default dbInstance;
