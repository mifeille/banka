import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {userData} from '../models/usersData';
import validation from '../helpers/userValidation';
import {accountData} from '../models/accountsData'

const allUsers = userData;
const allAccounts = accountData;

export default class authUsers{
   static getAll(req, res){
        const allUsers= userData;
        return res.send({
            status :200,
            data: allUsers
        })
    };

    static registerUser(req, res){
        try{
            if(validation.validateSignup(req, res)){
                const users = allUsers.filter(user => user.email == req.body.email);
                if(users.length === 1){
                   return res.status(409).json({
                        status:409,
                        message: "This email already exists"
                    })
                }
                
                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    const user = {
                        id:allUsers.length +1,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash,
                        type:"client"
                    }
                    allUsers.push(user);
                    const users = allUsers.filter(user => user.email == req.body.email);
                    const token = jwt.sign({
                        email: req.body.email
                    }, process.env.JWTSECRETKEY,
                    {
                        expiresIn: "24h"
                    });
                    let id=user.id,firstName=user.firstName,lastName=user.lastName,email=user.email,type=user.type;
                    res.status(201).json({
                        status :201,
                        message : "Your user account has been created",
                        data: {token,id,firstName,lastName,email,type}
                    });
                });
            }
        }
        catch(err){
            return res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }

    static loginUser (req, res){
        try{
            const allUsers = userData;
            let oneUser;
            if(validation.validateLogin(req, res)){
                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    oneUser = {
                        email: req.body.email,
                        password: hash
                    }
                        
                    const users = allUsers.filter(user =>user.email==oneUser.email);
                    if(users.length<1){
                        return res.status(401).json({
                            status:401,
                            message: "Incorrect email or password"
                        });
                    }
                    const userPassword = allUsers.find(user => user.email == req.body.email);
                    bcrypt.compare(req.body.password, userPassword.password, function (err, result) {
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
                            let id = users[0].id, firstName = users[0].firstName,lastName = users[0].lastName , email=req.body.email;
                            return res.status(200).json({
                                status:200,
                                message : "You have successfully log in Banka",
                                data: {token, id, firstName, lastName, email}
                            });
                        }
                    });
                })
            }
        } catch(err){
            res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }

    static getUserAccount(req, res){

        let decodedEmail;
            jwt.verify(req.token,process.env.JWTSECRETKEY,(err,decoded)=>{
                if(err){
                    return res.status(403).json({
                        status:403,
                        error:"A token must be provided!"
                    });
                }
                decodedEmail = decoded.email;
            });

            const user = allUsers.filter(oneUser => oneUser.email == decodedEmail);
            console.log(user[0].id);
            
            const accounts = allAccounts.filter(account => account.owner == user[0].id);
            console.log(accounts);
            return res.send({
                message: "Your Bank accounts :",
                status :200,
                data: accounts
            })


    }


}
