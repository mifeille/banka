import queryDb from './tables';
import pool from './dbconnection';

const createTables = async () => {
  try {
    await pool.query(queryDb.registerClientTable);
    await pool.query(queryDb.registerAccountTable);
    await pool.query(queryDb.registerTransactionTable);
    await pool.query(queryDb.registerNotificationTable);
  } catch (err) {
    console.log(err);
  }
};

export default createTables();
