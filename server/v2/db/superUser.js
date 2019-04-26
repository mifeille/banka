import bcrypt from 'bcrypt';
import pool from './dbconnection';

const superUser = async () => {
  try {
    const hash = bcrypt.hashSync(process.env.superUserPassword, 10);
    const firstAdmin = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING';
    const value = ['Laetitia', 'Kabeho', process.env.superUserEmail, hash, 'staff', 'true'];
    await pool.query(firstAdmin, value);
  } catch (err) {
    console.log(err);
  }
};

export default superUser();
