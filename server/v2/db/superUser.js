import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from './dbconnection';

dotenv.config();

const superUser = async () => {
  try {
    const hash = bcrypt.hashSync(process.env.PASSWORD, 10);
    const firstAdmin = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES ($1, $2, $3, $4, $5, $6)';
    const value = ['Laetitia', 'Kabeho', process.env.EMAIL, hash, 'staff', 'true'];
    await pool.query(firstAdmin, value);
  } catch (err) {
    console.log(err);
  }
};

export default superUser();
