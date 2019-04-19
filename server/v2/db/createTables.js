import { Pool } from 'pg';
import dotenv from 'dotenv';
import queryDb from './tables';


dotenv.config();

const pool = new Pool({ 
   connectionString : process.env.DATABASE_URL
});
const registerClientsTable = async () => {
    const queryText = queryDb.registerClientTable;
    await pool.query(queryText)
      .then(async () => {
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };
  (async () => {
      await registerClientsTable();
      pool.end();
      console.log(' Clients');
    })()
    .catch((err) => {
        console.log(err);
    })