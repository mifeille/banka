import moment from 'moment';
import validation from '../helpers/accountValidation';
import statusValidation from '../helpers/accountStatus';
import db from '../db/dbconnection';


const accounts = {

  async createAccount(req, res) {
    try {
      if (validation.validateAccount(req, res)) {
        const user = 'SELECT * FROM users WHERE email = $1';
        const value = [req.user.email];
        const { rows } = await db.query(user, value);

        if (!rows) {
          return res.status(404).json({
            status: 404,
            message: 'Create a user account first!',
          });
        }
        const bankAccount = `${rows[0].id}${Date.now()}`;
        const account = {
          accountnumber: parseInt(bankAccount, 10),
          createdon: moment(new Date()),
          owner: rows[0].id,
          type: req.body.type,
          status: 'draft',
          openingbalance: 0,
          balance: 0,
        };
        const query = 'INSERT INTO accounts (accountnumber,createdon,owner,type,status,openingbalance,balance) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [
          account.accountnumber, account.createdon, account.owner, account.type, account.status,
          account.openingbalance, account.balance];
        await db.query(query, values);
        const {
          accountnumber, email, status, type, openingbalance,
        } = account;
        const firstName = rows[0].firstname; const lastName = rows[0].lastname;
        return res.status(201).json({
          status: 201,
          message: 'Bank account created successfully',
          data: {
            accountnumber, firstName, lastName, email, type, status, openingbalance,
          },
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
  },

  async updateAccount(req, res) {
    try {
      if (statusValidation.validateAccount(req, res)) {
        const { accountNumber } = req.params;
        const admin = 'SELECT * FROM users WHERE email = $1';
        const findAdmin = await db.query(admin, [req.user.email]);
        if (findAdmin.rows === 0) {
          return res.status(403).json({
            status: 403,
            message: 'Only an admin can activate or deactivate a Bank account',
          });
        }
        if (findAdmin.rows[0].isadmin === 'false') {
          return res.status(403).json({
            status: 403,
            message: 'Only an admin can activate or deactivate a Bank account',
          });
        }
        const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
        const findAccount = await db.query(account, [accountNumber]);
        if (findAccount.rowCount === 0) {
          return res.status(404).json({
            status: 404,
            message: 'Bank account not found',
          });
        }
        if (findAccount.rows[0].status === req.body.status) {
          return res.status(409).json({
            status: 409,
            message: `This account is already ${req.body.status}`,
          });
        }
        const accountUpdate = 'UPDATE accounts SET status = $1 WHERE accountnumber = $2';
        await db.query(accountUpdate, [req.body.status, accountNumber]);
        const { status } = req.body;
        return res.status(200).json({
          status: 200,
          message: 'Operation Successful',
          data: { accountNumber, status },
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
  },

  async deleteAccount(req, res) {
    const admin = 'SELECT * FROM users WHERE email = $1';
    const findAdmin = await db.query(admin, [req.user.email]);
    if (findAdmin.rows === 0) {
      return res.status(403).json({
        status: 403,
        message: 'Only an admin can delete a Bank account',
      });
    }
    if (findAdmin.rows[0].isadmin !== 'true') {
      return res.status(403).json({
        status: 403,
        message: 'Only an admin can delete a Bank account',
      });
    }
    if (findAdmin.rows[0].isadmin === 'true') {
      const { accountNumber } = req.params;
      const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
      const query = await db.query(account, [accountNumber]);
      if (query.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Bank account not found',
        });
      }
      if (query.rows[0].balance > 0) {
        return res.status(400).json({
          status: 400,
          message: `You can not delete this account,bacause it has ${query.rows[0].balance} on it`,
        });
      }
      const accountDelete = 'DELETE FROM accounts WHERE accountnumber = $1';
      await db.query(accountDelete, [accountNumber]);
      return res.status(200).json({
        status: 200,
        message: `Bank account number ${accountNumber} successfully deleted`,
      });
    }
  },

  async userAccount(req, res) {
    const client = 'SELECT * FROM users WHERE email = $1';
    const findClient = await db.query(client, [req.user.email]);
    if (findClient.rows === 0) {
      return res.status(400).json({
        status: 400,
        message: 'You must create a user account first!',
      });
    }
    const clientId = findClient.rows[0].id;
    const findAccount = 'SELECT * FROM accounts WHERE owner = $1';
    const allAccounts = await db.query(findAccount, [clientId]);
    if (allAccounts.rows === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No Bank account found, Create your first account now!',
      });
    }
    return res.status(200).json({
      status: 200,
      accounts: allAccounts.rows,
    });
  },

  async userFindAccount(req, res) {
    const client = 'SELECT * FROM clients WHERE email = $1';
    const findClient = await db.query(client, [req.user.email]);
    if (findClient.rows === 0) {
      return res.status(400).json({
        status: 400,
        message: 'You must create a user account first!',
      });
    }
    const clientId = findClient.rows[0].id;
    const { accountNumber } = req.params;
    const findAccount = 'SELECT * FROM accounts WHERE owner = $1 AND accountnumber = $2';
    const allAccounts = await db.query(findAccount, [clientId, accountNumber]);
    if (allAccounts.rows === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No Bank account found!',
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Account details',
      data: accounts.rows[0],
    });
  },

};


export default accounts;
