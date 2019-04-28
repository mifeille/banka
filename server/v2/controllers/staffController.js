import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validation from '../helpers/userValidation';
import db from '../db/dbconnection';

const authStaff = {
  async registerStaff(req, res) {
    try {
      if (validation.validateSignup(req, res)) {
        const admin = 'SELECT * FROM users WHERE email = $1';
        const adminFound = await db.query(admin, [req.user.email]);
        if (adminFound.rowCount === 0) {
          return res.status(403).json({
            status: 403,
            message: 'you do not have the right to create a staff account!',
          });
        }
        if (req.user.isadmin === 'true') {
          if (!req.body.isAdmin) {
            return res.status(400).json({
              status: 400,
              message: 'isAdmin field is required!',
            });
          }
          const staffAdmin = req.body.isAdmin;
          const lowerAdmin = staffAdmin.toLowerCase();
          if (lowerAdmin !== 'yes' && lowerAdmin !== 'no') {
            return res.status(400).json({
              status: 400,
              message: 'isAdmin should be yes or no',
            });
          }
          const trimEmail = (req.body.email).trim();
          const validEmail = trimEmail.toLowerCase();
          const used = 'SELECT * FROM users WHERE (email= $1)';
          const emailvalue = [validEmail];
          const findStaff = await db.query(used, emailvalue);
          if (findStaff.rows[0]) {
            return res.status(409).json({
              status: 409,
              message: 'This email address is already in use',
            });
          }
          let isAdmin = false;
          if (lowerAdmin === 'yes') {
            isAdmin = true;
          } else {
            isAdmin = false;
          }
          const hash = bcrypt.hashSync(req.body.password, 10);
          const staff = {
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: validEmail,
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
            id: result.rows[0].id,
            firstname: result.rows[0].firstname,
            lastname: result.rows[0].lastname,
            email: result.rows[0].email,
            type: result.rows[0].type,
            isadmin: result.rows[0].isadmin,
          }, process.env.JWTSECRETKEY,
          {
            expiresIn: '3h',
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
  async getAllAccounts(req, res) {
    const admin = 'SELECT * FROM users WHERE email = $1';
    const findAdmin = await db.query(admin, [req.user.email]);
    if (findAdmin.rowCount === 0) {
      return res.status(403).json({
        status: 403,
        message: 'You do not have the right to view bank accounts',
      });
    }

    if (findAdmin.rows[0].isadmin !== 'true') {
      return res.status(403).json({
        status: 403,
        message: 'You do not have the right to view bank accounts',
      });
    }
    if (req.query.status) {
      const { status } = req.query;
      if (status !== 'draft' && status !== 'dormant' && status !== 'active') {
        return res.status(400).json({
          status: 400,
          message: 'Account status must be active, dormant or draft!',
        });
      }
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
      return res.status(403).json({
        status: 403,
        message: 'You do not have the right to view user bank accounts',
      });
    }

    if (findAdmin.rows[0].isadmin !== 'true') {
      return res.status(403).json({
        status: 403,
        message: 'You do not have the right to view user bank accounts',
      });
    }
    const view = 'SELECT accounts.accountnumber,accounts.owner,accounts.createdon,accounts.type,accounts.status,accounts.balance FROM users INNER JOIN accounts ON accounts.owner= users.id AND email = $1';
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
