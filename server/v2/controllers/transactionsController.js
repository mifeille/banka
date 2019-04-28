import moment from 'moment';
import db from '../db/dbconnection';

const transaction = {
  async creditAccount(req, res) {
    const cashier = 'SELECT * FROM users WHERE email = $1';
    const findCashier = await db.query(cashier, [req.user.email]);
    if (findCashier.rows === 0) {
      return res.status(403).json({
        status: 403,
        message: 'Only a cashier can credit a Bank account!',
      });
    }
    if (findCashier.rows[0].type === 'client') {
      return res.status(403).json({
        status: 403,
        message: 'Only a cashier can credit a Bank account!',
      });
    }
    if (findCashier.rows[0].isadmin === 'true') {
      return res.status(403).json({
        status: 403,
        message: 'Only a cashier can credit a Bank account!',
      });
    }
    const accountNumb = req.params.accountNumber;
    const isValid = /^[0-9]+$/;
    if (!isValid.test(accountNumb)) {
      return res.status(404).json({
        status: 404,
        message: 'Bank account not found',
      });
    }
    const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
    const accountCredit = await db.query(account, [accountNumb]);

    if (accountCredit.rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Bank account not found',
      });
    }
    if (accountCredit.rows) {
      const { owner } = accountCredit.rows[0];
      if (accountCredit.rows[0].status === 'draft' || accountCredit.rows[0].status === 'dormant') {
        return res.status(400).json({
          status: 400,
          message: 'You have to activate this account first',
        });
      }
      if (!req.body.amount) {
        return res.status(400).json({
          status: 400,
          message: 'The amount to credit is required',
        });
      }
      const isValidAmount = /^[\d.]+$/;
      if (!isValidAmount.test(req.body.amount)) {
        return res.status(400).json({
          status: 400,
          message: 'You cannot credit an account with a negative value or with caracters',
        });
      }
      const findAccount = await db.query(account, [accountNumb]);
      const credit = {
        createdon: moment(new Date()),
        type: 'credit',
        accountnumber: accountNumb,
        amount: req.body.amount,
        oldbalance: findAccount.rows[0].balance,
        newbalance: parseFloat(findAccount.rows[0].balance) + parseFloat(req.body.amount),
      };

      const creditTransaction = 'INSERT INTO transactions (createdon,type,accountnumber,amount,oldbalance,newbalance)VALUES ($1, $2, $3, $4, $5, $6)';
      await db.query(creditTransaction, [credit.createdon, credit.type,
        credit.accountnumber, credit.amount, credit.oldbalance, credit.newbalance]);
      const accountUpdate = 'UPDATE accounts SET balance =$1 WHERE accountnumber = $2';
      await db.query(accountUpdate, [credit.newbalance, accountNumb]);

      const notification = 'INSERT INTO notifications (createdon,owner,message)VALUES ($1, $2, $3)';
      const message = `Your Bank account ${credit.accountnumber} has been credited of ${credit.amount}. For more details check your account transactions.`;
      await db.query(notification, [credit.createdon, owner, message]);

      const {
        accountNumber, amount, type, oldbalance, newbalance,
      } = credit;
      const cashierName = (`${findCashier.rows[0].firstname} ${findCashier.rows[0].lastname}`);
      return res.status(201).json({
        status: 201,
        message: 'Transaction sucessful',
        data: {
          accountNumber, amount, cashierName, type, oldbalance, newbalance,
        },
      });
    }
  },

  async debitAccount(req, res) {
    const cashier = 'SELECT * FROM users WHERE email = $1';
    const findCashier = await db.query(cashier, [req.user.email]);
    if (findCashier.rows === 0) {
      return res.status(403).json({
        status: 403,
        message: 'Only a cashier can debit a Bank account!',
      });
    }
    if (findCashier.rows[0].type === 'client') {
      return res.status(403).json({
        status: 403,
        message: 'Only a cashier can debit a Bank account!',
      });
    }
    if (findCashier.rows[0].isadmin === 'true') {
      return res.status(403).json({
        status: 403,
        message: 'Only a cashier can debit a Bank account!',
      });
    }
    const accountNumb = req.params.accountNumber;
    const isValid = /^[0-9]+$/;
    if (!isValid.test(accountNumb)) {
      return res.status(404).json({
        status: 404,
        message: 'Bank account not found',
      });
    }
    if (!req.body.amount) {
      return res.status(400).json({
        status: 400,
        message: 'The amount to debit is required!',
      });
    }
    const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
    const accountDebit = await db.query(account, [accountNumb]);

    if (accountDebit.rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Bank account not found',
      });
    }
    if (accountDebit.rows) {
      const { owner } = accountDebit.rows[0];
      if (accountDebit.rows[0].status === 'draft' || accountDebit.rows[0].status === 'dormant') {
        return res.status(400).json({
          status: 400,
          message: 'You have to activate this account first',
        });
      }
      const isValidAmount = /^[\d.]+$/;
      if (!isValidAmount.test(req.body.amount)) {
        return res.status(400).json({
          status: 400,
          message: 'You cannot debit an account with a negative value or with caracters',
        });
      }

      if (accountDebit.rows[0].balance < req.body.amount) {
        return res.status(400).json({
          status: 400,
          message: 'You do not have that amount on your account',
        });
      }
      const accountC = await db.query(account, [accountNumb]);
      const debit = {
        createdon: moment(new Date()),
        type: 'debit',
        accountnumber: accountNumb,
        amount: req.body.amount,
        oldbalance: accountC.rows[0].balance,
        newbalance: parseFloat(accountC.rows[0].balance) - parseFloat(req.body.amount),
      };

      const debitTransaction = 'INSERT INTO transactions (createdon,type,accountnumber,amount,oldbalance,newbalance)VALUES ($1, $2, $3, $4, $5, $6)';
      await db.query(debitTransaction, [debit.createdon, debit.type, debit.accountnumber,
        debit.amount, debit.oldbalance, debit.newbalance]);

      const accountUpdate = 'UPDATE accounts SET balance =$1 WHERE accountnumber = $2';
      await db.query(accountUpdate, [debit.newbalance, debit.accountnumber]);

      const notification = 'INSERT INTO notifications (createdon,owner,message)VALUES ($1, $2, $3)';
      const message = `Your Bank account ${debit.accountnumber} has been debited of ${debit.amount}. For more details check your account transactions.`;
      await db.query(notification, [debit.createdon, owner, message]);

      const {
        accountNumber, amount, transactionType, oldbalance, newbalance,
      } = debit;
      const cashierInfo = (`${findCashier.rows[0].firstname} ${findCashier.rows[0].lastname}`);
      return res.status(201).json({
        status: 201,
        message: 'Transaction sucessful',
        data: {
          accountNumber, amount, cashierInfo, transactionType, oldbalance, newbalance,
        },
      });
    }
  },

  async transactionsHistory(req, res) {
    const client = 'SELECT * FROM users WHERE email = $1';
    const findClient = await db.query(client, [req.user.email]);
    if (findClient.rows === 0) {
      return res.status(400).json({
        status: 400,
        message: 'You must create a user account first!',
      });
    }
    const { accountNumber } = req.params;
    const isValid = /^[0-9]+$/;
    if (!isValid.test(accountNumber)) {
      return res.status(404).json({
        status: 404,
        message: 'Bank account not found',
      });
    }
    const acc = 'SELECT * FROM accounts WHERE accountnumber = $1';
    const findAccount = await db.query(acc, [accountNumber]);
    if (findAccount.rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Account not found!',
      });
    }
    if (findAccount.rows[0].owner !== req.user.id && req.user.type !== 'staff') {
      return res.status(403).json({
        status: 403,
        message: 'You do not have the right to view transactions on this account!',
      });
    }
    const history = 'SELECT id,type,amount,oldbalance,newbalance FROM transactions WHERE accountnumber = $1';
    const transactionsHistory = await db.query(history, [accountNumber]);
    if (transactionsHistory.rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No transaction found on this account!',
      });
    }
    return res.status(200).json({
      status: 200,
      message: `${accountNumber} transaction history​ :`,
      data: transactionsHistory.rows,
    });
  },

  async getAtransaction(req, res) {
    const client = 'SELECT * FROM users WHERE email = $1';
    const findClient = await db.query(client, [req.user.email]);
    if (findClient.rows === 0) {
      return res.status(400).json({
        status: 400,
        message: 'You must create a user account first!',
      });
    }
    const { transactionId } = req.params;
    const isValid = /^[0-9]+$/;
    if (!isValid.test(transactionId)) {
      return res.status(404).json({
        status: 404,
        message: 'Transaction not found',
      });
    }
    if (typeof transactionId !== 'number') {
      return res.status(404).json({
        status: 404,
        message: 'Transaction not found',
      });
    }
    const findTransaction = 'SELECT * FROM transactions WHERE id = $1';
    const aTransaction = await db.query(findTransaction, [transactionId]);
    if (aTransaction.rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No transaction not found!',
      });
    }
    const findAccount = 'SELECT * FROM accounts WHERE accountnumber = $1';
    const account = await db.query(findAccount, [aTransaction.rows[0].accountnumber]);

    if (account.rows[0].owner !== req.user.id) {
      return res.status(403).json({
        status: 403,
        message: 'You do not have the right to view this transaction!',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Transaction details:',
      data: aTransaction.rows[0],
    });
  },

};

export default transaction;
