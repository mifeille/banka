import db from './dbconnection';

const dropUsers = async () => {
  const queryText = ('DROP TABLE IF EXISTS users CASCADE');
  await db.query(queryText)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await dropUsers();
  console.log('users table deleted');
})()
  .catch((err) => {
    console.log(err);
  });

const dropAccounts = async () => {
  await dropUsers();
  const queryText = ('DROP TABLE IF EXISTS accounts CASCADE');
  await db.query(queryText)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await dropAccounts();
  console.log('Accounts table deleted');
})()
  .catch((err) => {
    console.log(err);
  });

const dropTransactions = async () => {
  await dropAccounts();
  const queryText = ('DROP TABLE IF EXISTS transactions CASCADE');
  await db.query(queryText)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await dropTransactions();
  console.log('Transactions table deleted');
})()
  .catch((err) => {
    console.log(err);
  });
const dropNotifications = async () => {
  await dropTransactions();
  const queryText = ('DROP TABLE IF EXISTS notifications CASCADE');
  await db.query(queryText)
    .then(async () => {
    })
    .catch((err) => {
      console.log(err);
    });
};
(async () => {
  await dropNotifications();
  console.log(' notifications table deleted');
})()
  .catch((err) => {
    console.log(err);
  });
