import { QueryResult } from "pg";

export interface PrismaReturn {
  data: QueryResult | null;
  error: boolean;
  errorMessage: string | null;
}
