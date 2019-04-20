import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validation from '../helpers/userValidation';
import db from '../db/dbconnection';

const authUsers = {
  async getAll(req, res){

    const allClients = 'SELECT * FROM clients';
    const { rows} = await db.query(allClients);
    return res.send({
      status :200,
      message: "The list of all Clients",
      data: rows
    })
  },
    
  async registerUser(req, res){
    
    try{
      if(validation.validateSignup(req, res)){
        const used = 'SELECT * FROM clients WHERE (email= $1)';
        const emailValue = [req.body.email];
        const findUser = await db.query(used, emailValue);
        if(findUser.rows[0]){
          return res.status(409).json({
            status:409,
            message: "This email address is already in use"
          })
        }
        const hash = bcrypt.hashSync(req.body.password, 10);
        const user = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          type:"client"
        }
        
        const query = 'INSERT INTO clients (firstname,lastname,email,password,type) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [user.firstname, user.lastname, user.email, user.password, user.type];
        const result = await db.query(query, values);
        const token = jwt.sign({
          email: user.email
        }, process.env.JWTSECRETKEY,
        {
          expiresIn: "24h"
        });
        if(result) {
          let id= result.rows[0].id, firstName=result.rows[0].firstname,lastName=result.rows[0].lastname,email=result.rows[0].email,type=result.rows[0].type;
          return res.status(201).json({
            status :201,
            message : "Welcome to Banka, Your user account has been created",
            data: {token,id,firstName,lastName,email,type}
          })
        }
      }
    } catch(err){
      return res.status(400).json({
        status:400,
        message: err.message
      });
    }
  },

  async loginUser (req, res){
    try{
      if(validation.validateLogin(req, res)){
        const hash = bcrypt.hashSync(req.body.password, 10);
        const used = 'SELECT * FROM clients WHERE (email= $1)';
        const emailValue = [req.body.email];
        const findUser = await db.query(used, emailValue);
        if(findUser.rows<1){
          return res.status(401).json({
            status:401,
             message: "Incorrect email or password"
          });
        }
        bcrypt.compare(req.body.password, findUser.rows[0].password, function (err, result) {
          if (result == false) {
            return res.status(401).json({
              status:401,
              message: "Incorrect email or password"
            });
          } else {
            const token = jwt.sign({
              email: req.body.email
            }, process.env.JWTSECRETKEY,
            { 
              expiresIn: "24h"
            });
            let id = findUser.rows[0].id, firstName = findUser.rows[0].firstName,lastName = findUser.rows[0].lastName , email=findUser.rows[0].email;
            return res.status(200).json({
              status:200,
              message : "You have successfully log in Banka",
              data: {token, id, firstName, lastName, email}
            });
          }
        });
      }
    } catch(err){
      res.status(400).json({
          status:400,
          message: err.message
      });
    }
  }
}


export default authUsers;