import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {userData} from '../models/usersData';
import validation from '../helpers/userValidation';

const allStaff = userData;

export default class authUsers{
   static getAll(req, res){
        return res.send({
            status :200,
            data: allStaff
        })
    };

    static registerStaff(req, res){
        try{
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
            const admins = allStaff.filter(admin => admin.email == decodedEmail); 
            if(admins[0].isAdmin == true) {
                if(validation.validateSignup(req, res)){
                    const staff = allStaff.filter(oneStaff => oneStaff.email == req.body.email);
                    if(staff.length === 1){
                    return res.status(409).json({
                            status:409,
                            message: "This Staff already exists"
                        })
                    }
                    let isAdmin = false;
                    bcrypt.hash(req.body.password, 10, (err, hash) =>{
                        if(req.body.isAdmin === "Yes") {
                            isAdmin =true;    
                        }
                        else {
                            isAdmin =false;
                        }
                        const staff = {
                            id:allStaff.length +1,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            type:"staff",
                            isAdmin : isAdmin
                        }
                        allStaff.push(staff);
                        const users = allStaff.filter(oneStaff => oneStaff.email == req.body.email);
                        const token = jwt.sign({
                            email: req.body.email
                        }, process.env.JWTSECRETKEY,
                        {
                            expiresIn: "24h"
                        });
                        let id=staff.id,firstName = staff.firstName, lastName = staff.lastName, email = staff.email, type = staff.type, isAdmin = staff.isAdmin;
                        res.status(201).json({
                            status :201,
                            message : "Staff account created",
                            data: {token,id,firstName,lastName,email,type,isAdmin}
                        });
                    });
                }
            } else {
                return res.status(400).json({
                    status :400,
                    message: "You do not have the right to create a staff account!"
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

    static loginStaff (req, res){

        try{

            if(validation.validateLogin(req, res)){
                
                const staff = allStaff.filter(oneStaff => oneStaff.email == req.body.email);
                if(staff.length<1){
                    return res.status(401).json({
                        status:401,
                        message: "Incorrect email or password"
                    });
                }
                
                 if(staff[0].type == "staff") {
                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                   
                    const staffPassword = allStaff.find(oneStaff => oneStaff.email == req.body.email);
                    bcrypt.compare(req.body.password, staffPassword.password, function (err, result) {
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
                            let id = staff[0].id, firstName = staff[0].firstName,lastName = staff[0].lastName , email=req.body.email, isAdmin= staff[0].isAdmin;
                            return res.status(200).json({
                                status:200,
                                message : "You have successfully log in Banka",
                                data: {token, id, firstName, lastName, email, isAdmin}
                            });
                        }
                    });
                })
            }

        }
            
        
        

        } catch(err){
            res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }
}
