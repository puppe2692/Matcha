import pool from "./db_pool";
import { Pool, QueryResult } from "pg";
import prismaFromWishInstance from "./prismaFromWish";

// here is to define the db initialization

const usersField: string =
  "id SERIAL PRIMARY KEY, username VARCHAR(32), email VARCHAR(32), password VARCHAR(255), firstname VARCHAR(32), lastname VARCHAR(32), gender VARCHAR(32), sex_pref VARCHAR(32), bio VARCHAR(500), hashtags VARCHAR(500), age INTEGER, verified BOOLEAN DEFAULT FALSE, connection_status BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT unique_name UNIQUE(username), CONSTRAINT unique_email UNIQUE(email)";

const tokenField: string =
  "id SERIAL PRIMARY KEY, token VARCHAR(255) NOT NULL, user_id INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour'";

// const imagesField: string =
//   "id SERIAL PRIMARY KEY, image VARCHAR(255) NOT NULL, index INTEGER, user_id INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP";

const statusField: string =
  "id SERIAL PRIMARY KEY, origin_user_id INTEGER REFERENCES users(id), destination_user_id INTEGER, status VARCHAR(10), last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CHECK (status IN ('viewed', 'liked', 'blocked'))";

const connectionField: string =
  "id SERIAL PRIMARY KEY, origin_user_id INTEGER REFERENCES users(id), destination_user_id INTEGER, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP";

const messageField: string =
  "id SERIAL PRIMARY KEY, sender_id INTEGER REFERENCES users(id), receiver_id INTEGER, date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP, seen BOOLEAN DEFAULT FALSE, content TEXT";



class Database {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async initDatabase(): Promise<boolean> {
    const initialized = await this.checkInit();
    if (!initialized) {
      try {
        await this.initTable("users", usersField);
        await this.initTable("tokens", tokenField);
        await this.initTable("status", statusField);
        await this.initTable("connection", connectionField);
        await this.initTable("messages", messageField);
        //await this.initTable("images", imagesField);
        await this.populateExample();
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return true;
    }
  }

  async checkInit(): Promise<boolean> {
    const data = await pool.query(
      `SELECT tablename FROM pg_tables WHERE tablename='users';`
    );
    if (!data.rows || data.rows.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async initTable(table: string, fields: string): Promise<void> {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${table}(${fields});` // to complete with more fields
    );
  }

  async populateExample(): Promise<void> {
    const usersValues = [
      ["user1", "user1@example.com", "password1", "John", "Doe", true],
      ["user2", "user2@example.com", "password2", "Jane", "Smith", true],
      ["user3", "user3@example.com", "password3", "Alice", "Johnson", true],
      ["user4", "user4@example.com", "password4", "Bob", "Brown", true],
      ["user5", "user5@example.com", "password5", "Carol", "Davis", true],
    ];

    for (const user of usersValues) {
      await prismaFromWishInstance.create(
        "users",
        ["username", "email", "password", "firstname", "lastname", "verified"],
        user
      );
    }

    const connectionsValues = [
      [1, 2, "2024-04-09 08:00:00"],
      [1, 3, "2024-04-09 08:05:00"],
      [1, 4, "2024-04-09 08:10:00"],
      [2, 3, "2024-04-09 08:15:00"],
      [3, 4, "2024-04-09 08:20:00"],
      [4, 5, "2024-04-09 08:25:00"],
    ];

    for (const connection of connectionsValues) {
      await prismaFromWishInstance.create(
        "connection",
        ["origin_user_id", "destination_user_id", "date"],
        connection
      );
    }

    const messagesValues = [
      [1, 2, "2024-04-09 08:00:00", "Hello, Jane!", true],
      [2, 1, "2024-04-09 08:05:00", "Hi, John!", true],
      [3, 1, "2024-04-09 08:10:00", "How are you, Alice?", true],
      [3, 2, "2024-04-09 08:15:00", "I'm doing well, John. Thanks!", true],
      [4, 3, "2024-04-09 08:20:00", "Hey, Bob!", true],
      [3, 4, "2024-04-09 08:22:00", "Hey, how are you!", false],
      [3, 4, "2024-04-09 08:22:00", "Long time no see", false],
      [3, 4, "2024-04-09 08:22:17", "Because I was at sea", false],
      [3, 4, "2024-04-09 08:22:44", "Hahaha I am so funny", false],
      [5, 4, "2024-04-09 08:25:00", "Hi, Carol!", false],
    ];

    for (const message of messagesValues) {
      await prismaFromWishInstance.create(
        "messages",
        ["sender_id", "receiver_id", "date_sent", "content", "seen"],
        message
      );
    }
  }
}

const dbInstance = new Database(pool);

export default dbInstance;
