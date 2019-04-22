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

    const registerEmployeesTable = async () => {
      const queryText = queryDb.registerStaffTable ;
      await pool.query(queryText)
        .then(async () => {
        })
        .catch((err) => {
          console.log(err);
        });
    };
    (async () => {
        await registerEmployeesTable ();
        console.log(' Staff');
      })()
      .catch((err) => {
          console.log(err);
      })

      const registertransactionsTable = async () => {
        const queryText = queryDb.registerTransactionTable ;
        await pool.query(queryText)
          .then(async () => {
          })
          .catch((err) => {
            console.log(err);
          });
      };
      (async () => {
          await registertransactionsTable ();
          console.log('Transactions');
        })()
        .catch((err) => {
            console.log(err);
        })

        const registerNotificationsTable = async () => {
          const queryText = queryDb.registerNotificationTable ;
          await pool.query(queryText)
            .then(async () => {
            })
            .catch((err) => {
              console.log(err);
            });
        };
        (async () => {
            await registerNotificationsTable ();
            console.log('Transactions');
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