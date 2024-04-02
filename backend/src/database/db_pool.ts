import { Pool } from "pg";

const Port: string = process.env.POSTGRES_PORT || "5432";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(Port, 10),
});

export default pool;
