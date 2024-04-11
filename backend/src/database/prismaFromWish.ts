import { Pool, QueryResult } from "pg";
import pool from "./db_pool";
import { PrismaReturn } from "../data_structures/data";

// all functions that need to return data will return null a PrismaReturn object
// this object contains:
// a data object which is a QueryResult in case of success or null otherwise
// a error boolean value indicating if there was an error or not
// an errorMessage that is the corresponding message in case of error or null otherwise

class PrismaFromWish {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async selectAll(
    table: string,
    conditions?: string[],
    values?: any[],
    keyword: string = "AND"
  ): Promise<PrismaReturn> {
    var data: QueryResult;

    try {
      if (!conditions) {
        data = await pool.query(`SELECT * FROM ${table};`);
      } else {
        var i: number = 1;
        var whereClause = "";
        for (const key of conditions) {
          if (i == 1) {
            whereClause += `${key} = $${i}`;
          } else {
            whereClause += ` ${keyword} ${key} = $${i}`;
          }
          i += 1;
        }
        data = await pool.query(
          `SELECT * FROM ${table} WHERE ${whereClause};`,
          values
        );
      }
      return { data: data, error: false, errorMessage: null };
    } catch (error: any) {
      return { data: null, error: true, errorMessage: error.message };
    }
  }

  async findFirstN(
    table: string,
    limit: number,
    conditions?: string[],
    values?: any[],
    keyword: string = "AND"
  ): Promise<PrismaReturn> {
    var data: QueryResult;

    try {
      if (!conditions) {
        data = await pool.query(`SELECT * FROM ${table} LIMIT ${limit};`);
      } else {
        var i: number = 1;
        var whereClause = "";
        for (const key of conditions) {
          if (i == 1) {
            whereClause += `${key} = $${i}`;
          } else {
            whereClause += ` ${keyword} ${key} = $${i}`;
          }
          i += 1;
        }
        data = await pool.query(
          `SELECT * FROM ${table} WHERE ${whereClause} LIMIT ${limit};`,
          values
        );
      }
      return { data: data, error: false, errorMessage: null };
    } catch (error: any) {
      return { data: null, error: true, errorMessage: error.message };
    }
  }

  async create(
    table: string,
    fields: string[],
    values: any[]
  ): Promise<PrismaReturn> {
    var data: QueryResult;

    try {
      var i: number = 1;
      var fieldsString: string = "";
      var placeholderString: string = "";
      for (const key of fields) {
        if (i == 1) {
          fieldsString += `${key}`;
          placeholderString += `$${i}`;
        } else {
          fieldsString += `, ${key}`;
          placeholderString += `, $${i}`;
        }
        i += 1;
      }

      data = await pool.query(
        `INSERT INTO ${table} (${fieldsString}) VALUES (${placeholderString}) RETURNING id;`,
        values
      );
      return { data: data, error: false, errorMessage: null };
    } catch (error: any) {
      return { data: null, error: true, errorMessage: error.message };
    }
  }

  async delete(
    table: string,
    conditions: string[],
    values: any[]
  ): Promise<PrismaReturn> {
    var data: QueryResult;

    try {
      var i: number = 1;
      var whereClause = "";
      for (const key of conditions) {
        if (i == 1) {
          whereClause += `${key} = $${i}`;
        } else {
          whereClause += ` AND ${key} = $${i}`;
        }
        i += 1;
      }
      data = await pool.query(
        `DELETE FROM ${table} WHERE ${whereClause};`,
        values
      );
      return { data: data, error: false, errorMessage: null };
    } catch (error: any) {
      return { data: null, error: true, errorMessage: error.message };
    }
  }

  async update(
    table: string,
    fieldsToModify: string[],
    newValues: any[],
    conditionFields: string[],
    conditionValues: any[]
  ): Promise<PrismaReturn> {
    var data: QueryResult;

    try {
      var i: number = 1;
      var j: number = 0;
      var modifyFields = "";
      var whereClause = "";
      for (const key of fieldsToModify) {
        if (i == 1) {
          modifyFields += `${key} = $${i}`;
        } else {
          modifyFields += `, ${key} = $${i}`;
        }
        i += 1;
      }
      for (const key of conditionFields) {
        if (j == 0) {
          whereClause += `${key} = $${i + j}`;
        } else {
          whereClause += ` AND ${key} = $${i + j}`;
        }
        j += 1;
      }
      data = await pool.query(
        `UPDATE ${table} SET ${modifyFields} WHERE ${whereClause};`,
        newValues.concat(conditionValues)
      );
      return { data: data, error: false, errorMessage: null };
    } catch (error: any) {
      return { data: null, error: true, errorMessage: error.message };
    }
  }

  async customQuery(query: string, values: any[]): Promise<PrismaReturn> {
    var data: QueryResult;

    try {
      data = await pool.query(query, values);
      return { data: data, error: false, errorMessage: null };
    } catch (error: any) {
      return { data: null, error: true, errorMessage: error.message };
    }
  }
}

const prismaFromWishInstance = new PrismaFromWish(pool);

export default prismaFromWishInstance;
