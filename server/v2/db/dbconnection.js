import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = {};

pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export default pool;
