import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validation from '../helpers/userValidation';
import db from '../db/dbconnection';

const authStaff = {
  async registerStaff(req, res) {
    try {
      if (validation.validateSignup(req, res)) {
        const admin = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(admin, [req.user.email]);
        if (!rows[0]) {
          return res.status(403).json({
            status: 403,
            message: 'you do not have the right to create a staff account!',
          });
        }
        if (rows[0].isadmin === 'true') {
          const used = 'SELECT * FROM users WHERE (email= $1)';
          const emailvalue = [req.body.email];
          const findStaff = await db.query(used, emailvalue);
          if (findStaff.rows[0]) {
            return res.status(409).json({
              status: 409,
              message: 'This email address is already in use',
            });
          }
          let isAdmin = false;
          if (req.body.isAdmin === 'Yes') {
            isAdmin = true;
          } else {
            isAdmin = false;
          }
          const hash = bcrypt.hashSync(req.body.password, 10);
          const staff = {
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            password: hash,
            type: 'staff',
            isadmin: isAdmin,
          };

          const query = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
          const values = [
            staff.firstname, staff.lastname, staff.email,
            staff.password, staff.type, staff.isadmin];
          const result = await db.query(query, values);
          const token = jwt.sign({
            email: req.body.email,
          }, process.env.JWTSECRETKEY,
          {
            expiresIn: '24h',
          });
          if (result) {
            const {
              id, firstname, lastname, email, type, isadmin,
            } = result.rows[0];
            return res.status(201).json({
              status: 201,
              message: 'Welcome to Banka, Your staff account has been created',
              data: {
                token, id, firstname, lastname, email, type, isadmin,
              },
            });
          }
        } else {
          return res.status(403).json({
            status: 403,
            message: 'you do not have the right to create a staff account!',
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
  },

  async loginStaff(req, res) {
    try {
      if (validation.validateLogin(req, res)) {
        const used = 'SELECT * FROM users WHERE (email= $1)';
        const emailValue = [req.body.email];
        const findUser = await db.query(used, emailValue);
        if (findUser.rows < 1) {
          return res.status(401).json({
            status: 401,
            message: 'Incorrect email or password',
          });
        }
        bcrypt.compare(req.body.password, findUser.rows[0].password, (err, result) => {
          if (result === false) {
            return res.status(401).json({
              status: 401,
              message: 'Incorrect email or password',
            });
          }
          const token = jwt.sign({
            id: findUser.rows[0].id,
            email: findUser.rows[0].email,
            firstname: findUser.rows[0].firstname,
            lastname: findUser.rows[0].lastname,
            type: findUser.rows[0].type,
            isadmin: findUser.rows[0].isadmin,
          }, process.env.JWTSECRETKEY,
          {
            expiresIn: '24h',
          });
          const {
            id, firstname, lastname, email, type, isadmin,
          } = findUser.rows[0];
          return res.status(200).json({
            status: 401,
            message: 'You have successfully log in Banka',
            data: {
              token, id, firstname, lastname, email, type, isadmin,
            },
          });
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
  },

  async getAllAccounts(req, res) {
    const admin = 'SELECT * FROM users WHERE email = $1';
    const findAdmin = await db.query(admin, [req.user.email]);
    if (findAdmin.rowCount === 0) {
      return res.status(400).json({
        status: 400,
        message: 'You do not have the right to view all bank accounts',
      });
    }

    if (findAdmin.rows[0].isadmin !== 'true') {
      return res.status(400).json({
        status: 400,
        message: 'You do not have the right to view all bank accounts',
      });
    }
    if (req.query.status) {
      const { status } = req.query;
      const account = 'SELECT * FROM accounts WHERE status = $1';
      const query = await db.query(account, [status]);
      if (query.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          message: `No ${status} Bank accounts found!`,
        });
      }


      return res.status(200).json({
        status: 200,
        message: `${status} Bank accounts`,
        data: query.rows,

      });
    }

    const allAccounts = 'SELECT * FROM accounts';
    const { rows } = await db.query(allAccounts);
    return res.send({
      status: 200,
      message: 'The list of all Bank accounts',
      data: rows,
    });
  },

  async getUserAccounts(req, res) {
    const { emailAddress } = req.params;
    const admin = 'SELECT * FROM users WHERE email = $1';
    const findAdmin = await db.query(admin, [req.user.email]);
    if (findAdmin.rowCount === 0) {
      return res.status(400).json({
        status: 400,
        message: 'You do not have the right to view user bank accounts',
      });
    }

    if (findAdmin.rows[0].isadmin !== 'true') {
      return res.status(400).json({
        status: 400,
        message: 'You do not have the right to view user bank accounts',
      });
    }
    const view = 'SELECT users.email,accounts.accountnumber,accounts.owner,accounts.createdon,accounts.type,accounts.status,accounts.balance FROM users INNER JOIN accounts ON accounts.owner= users.id AND email = $1';
    const value = await db.query(view, [emailAddress]);
    if (value.rowCount > 0) {
      return res.status(200).json({
        status: 200,
        message: `${emailAddress} Bank accounts`,
        data: value.rows,

      });
    }
    return res.status(404).json({
      status: 404,
      message: `No Bank accounts found for the user ${emailAddress}`,

    });
  },
};

export default authStaff;
