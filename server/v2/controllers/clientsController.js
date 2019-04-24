import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validation from '../helpers/userValidation';
import db from '../db/dbconnection';

const authUsers = {
  async getAll(req, res) {
    const allClients = 'SELECT * FROM users';
    const { rows } = await db.query(allClients);
    return res.send({
      status: 200,
      message: 'The list of all Clients',
      data: rows,
    });
  },

  async registerUser(req, res) {
    try {
      if (validation.validateSignup(req, res)) {
        const trimEmail = (req.body.email).trim();
        const validEmail = trimEmail.toLowerCase();
        const used = 'SELECT * FROM users WHERE (email= $1)';
        const emailValue = [validEmail];
        const findUser = await db.query(used, emailValue);
        if (findUser.rowCount > 0) {
          return res.status(409).json({
            status: 409,
            message: 'This email address is already in use',
          });
        }
        const hash = bcrypt.hashSync(req.body.password, 10);
        const user = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: validEmail,
          password: hash,
          type: 'client',
          isadmin: false,
        };

        const query = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [
          user.firstname, user.lastname, user.email, user.password, user.type, user.isadmin];
        const result = await db.query(query, values);
        const token = jwt.sign({
          id: result.rows[0].id,
          email: result.rows[0].email,
          firstname: result.rows[0].firstname,
          lastname: result.rows[0].lastname,
          type: result.rows[0].type,
          isadmin: result.rows[0].isadmin,
        }, process.env.JWTSECRETKEY,
        {
          expiresIn: '24h',
        });
        if (result) {
          const {
            id, firstname, lastname, email, type,
          } = result.rows[0];

          return res.status(201).json({
            status: 201,
            message: 'Welcome to Banka, Your user account has been created',
            data: {
              token, id, firstname, lastname, email, type,
            },
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

  async loginUser(req, res) {
    try {
      if (validation.validateLogin(req, res)) {
        const trimEmail = req.body.email.trim();
        const used = 'SELECT * FROM users WHERE (email= $1)';
        const emailValue = [trimEmail];
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
            firstname: findUser.rows[0].firstname,
            lastname: findUser.rows[0].lastname,
            email: findUser.rows[0].email,
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
            status: 200,
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
};

export default authUsers;
