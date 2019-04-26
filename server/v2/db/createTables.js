import bcrypt from 'bcrypt';
import queryDb from './tables';
import pool from './dbconnection';

const createTables = async () => {
  try {
    await pool.query(queryDb.registerClientTable);
    await pool.query(queryDb.registerAccountTable);
    await pool.query(queryDb.registerTransactionTable);
    await pool.query(queryDb.registerNotificationTable);
    const hash = bcrypt.hashSync(process.env.superUserPassword, 10);
    const superUser = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING';
    const value = ['Laetitia', 'Kabeho', process.env.superUserEmail, hash, 'staff', 'true'];
    await pool.query(superUser, value);
  } catch (err) {
    console.log(err);
  }
};

export default createTables();
