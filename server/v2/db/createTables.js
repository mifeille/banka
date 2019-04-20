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
      });
  };
  (async () => {
      await registerClientsTable();
      console.log(' Clients');
    })()
    .catch((err) => {
        console.log(err);
    })

    const registerAccountsTable = async () => {
      const queryText = queryDb.registerAccountTable;
      await pool.query(queryText)
        .then(async () => {
        })
        .catch((err) => {
          console.log(err);
          pool.end();
        });
    };
    (async () => {
        await registerAccountsTable();
        pool.end();
        console.log('Accounts');
      })()
      .catch((err) => {
          console.log(err);
      })