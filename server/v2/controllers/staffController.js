import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validation from '../helpers/userValidation';
import db from '../db/dbconnection';

const authStaff = {
    async registerStaff(req, res){
        try{
            let decodedEmail;
            jwt.verify(req.token,process.env.JWTSECRETKEY,(err,decoded)=>{
                if(err){
                    return res.status(403).json({
                        message: err.message,
                        status:403,
                        error:"A token must be provided!"
                    });
                }
                decodedEmail = decoded.email;
            });
            if(validation.validateSignup(req, res)){
                const admin = 'SELECT * FROM staff WHERE email = $1';
                const {rows} = await db.query(admin, [decodedEmail]);
                if(!rows[0]){
                    return res.status(400).json({
                        status:400,
                        message: 'you do not have the right to create a staff account!'
                    })
                }
                if(rows[0].isadmin === 'true') {
                    const used = 'SELECT * FROM staff WHERE (email= $1)';
                    const emailvalue = [req.body.email];
                    const findStaff = await db.query(used, emailvalue);
                    if(findStaff.rows[0]){
                        return res.status(409).json({
                            status:409,
                            message: "This email address is already in use"
                        })
                    }
                    let isAdmin = false;
                    if(req.body.isadmin === "Yes") {
                        isAdmin =true;    
                    } else {
                        isAdmin =false;
                    }
                    const hash = bcrypt.hashSync(req.body.password, 10);
                    const staff = {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                        type:"staff",
                        isadmin: isAdmin
                    }
                
                    const query = 'INSERT INTO staff (firstname,lastname,email,password,type,isadmin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                    const values = [staff.firstname, staff.lastname, staff.email, staff.password, staff.type, staff.isadmin];
                    const result = await db.query(query, values);
                    const token = jwt.sign({
                        email: req.body.email
                    }, process.env.JWTSECRETKEY,
                    {
                        expiresIn: "24h"
                    });
                    if(result) {
                        let id= result.rows[0].id, firstName=result.rows[0].firstname,lastName=result.rows[0].lastname,email=result.rows[0].email,type=result.rows[0].type, isAdmin=result.rows[0].isadmin;
                        return res.status(201).json({
                            status :201,
                            message : "Welcome to Banka, Your staff account has been created",
                            data: {token,id,firstName,lastName,email,type,isAdmin}
                        })
                    }
                } 
                
                else { 
                    return res.status(400).json({
                        status:400,
                        message: 'you do not have the right to create a staff account!'
                    }); 
                }
            }
        } catch(err){
            return res.status(400).json({
                status:400,
                message: err.message
            });
        }
    },
    
    async loginStaff (req, res){
        try{
            if(validation.validateLogin(req, res)){
                const hash = bcrypt.hashSync(req.body.password, 10);
                const used = 'SELECT * FROM staff WHERE (email= $1)';
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
                    let id = findUser.rows[0].id, firstName = findUser.rows[0].firstname,lastName = findUser.rows[0].lastname , email=findUser.rows[0].email;
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

export default authStaff;