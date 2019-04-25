import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = {}

if (process.env.NODEENV === 'DEV') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

if (process.env.NODEENV === 'TEST') {
  pool = new Pool({
    connectionString: process.env.DATABASETEST,
  });
}

export default pool;
