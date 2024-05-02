import pool from "./db_pool";
import { Pool, QueryResult } from "pg";
import prismaFromWishInstance from "./prismaFromWish";
import * as data from "../../data/fake_profiles.json";
import { hashPassword } from "../routes/auth/auth-utils";

//TODO: add last seen for the user
const usersField: string =
  "id SERIAL PRIMARY KEY, username VARCHAR(32), email VARCHAR(32), password VARCHAR(255), firstname VARCHAR(32), lastname VARCHAR(32), gender VARCHAR(32), sex_pref VARCHAR(32), bio VARCHAR(500), hashtags VARCHAR(255)[10], age INTEGER, verified BOOLEAN DEFAULT FALSE, connection_status BOOLEAN DEFAULT FALSE, profile_picture VARCHAR(255)[5], latitude FLOAT DEFAULT 48, longitude FLOAT DEFAULT 2, fame_rating INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT unique_name UNIQUE(username), CONSTRAINT unique_email UNIQUE(email), CONSTRAINT profile_picture_length CHECK (array_length(profile_picture, 1) <= 5), CONSTRAINT hashtags_length CHECK (array_length(hashtags, 1) <= 10)";

const tokenField: string =
  "id SERIAL PRIMARY KEY, token VARCHAR(255) NOT NULL, user_id INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour'";

const statusField: string =
  "id SERIAL PRIMARY KEY, origin_user_id INTEGER REFERENCES users(id), destination_user_id INTEGER, status VARCHAR(10), last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CHECK (status IN ('viewed', 'liked', 'blocked'))";

const connectionField: string =
  "id SERIAL PRIMARY KEY, origin_user_id INTEGER REFERENCES users(id), destination_user_id INTEGER, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP";

const messageField: string =
  "id SERIAL PRIMARY KEY, sender_id INTEGER REFERENCES users(id), receiver_id INTEGER, date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP, seen BOOLEAN DEFAULT FALSE, content TEXT";

const notificationField: string =
  "id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, seen BOOLEAN DEFAULT FALSE, content TEXT";

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
        await this.initTable("notifications", notificationField);
        await this.populateExample(data);
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

  async populateExample(data: any): Promise<void> {
    console.log("-------------------------------------------");
    console.log("Starting db population");
    console.log(data.default);
    for (const user of data.default) {
      console.log("creating user");
      console.log(user);
      user.password = await hashPassword(user.password);
      await prismaFromWishInstance.create(
        "users",
        [
          "username",
          "email",
          "password",
          "firstname",
          "lastname",
          "gender",
          "sex_pref",
          "bio",
          "hashtags",
          "age",
          "verified",
          "profile_picture",
          "latitude",
          "longitude",
          "fame_rating",
        ],
        [
          user.username,
          user.email,
          user.password,
          user.firstname,
          user.lastname,
          user.gender,
          user.sex_pref,
          user.bio,
          user.hashtags,
          user.age,
          user.verified,
          user.profile_picture,
          user.latitude,
          user.longitude,
          user.fame_rating,
        ]
      );
    }
    console.log("-------------------------------------------");
    console.log("Ending db population");
  }
}

const dbInstance = new Database(pool);

export default dbInstance;
