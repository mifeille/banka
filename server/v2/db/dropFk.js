import dotenv from 'dotenv';
import pool from './dbconnection';

dotenv.config();

const dropFkey = async () => {
  try {
    const query = 'ALTER TABLE accounts DROP CONSTRAINT constraint_fkey';
    await pool.query(query);
  } catch (err) {
    console.log(err);
  }
};

export default dropFkey();
