import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import queryDb from './tables';
import pool from './dbconnection';

dotenv.config();

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
  console.log(' Users');
})()
  .catch((err) => {
    console.log(err);
  });

const registerAccountsTable = async () => {
  await registerClientsTable();
  const queryText = queryDb.registerAccountTable;
  await pool.query(queryText)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await registerAccountsTable();
  console.log('Accounts');
})()
  .catch((err) => {
    console.log(err);
  });

const registertransactionsTable = async () => {
  await registerAccountsTable();
  const queryText = queryDb.registerTransactionTable;
  await pool.query(queryText)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await registertransactionsTable();
  console.log('Transactions');
})()
  .catch((err) => {
    console.log(err);
  });

const registerNotificationsTable = async () => {
  const queryText = queryDb.registerNotificationTable;
  await pool.query(queryText)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await registerNotificationsTable();

  console.log('Notifications');
})()
  .catch((err) => {
    console.log(err);
  });

const registerAdmin = async () => {
  const hash = bcrypt.hashSync(process.env.superUserPassword, 10);
  const queryText = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING';
  const value = ['Laetitia', 'Kabeho', process.env.superUserEmail, hash, 'staff', 'true'];
  await registerClientsTable();
  await pool.query(queryText, value)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await registerAdmin();

  console.log('Super User');
})()
  .catch((err) => {
    console.log(err);
  });
