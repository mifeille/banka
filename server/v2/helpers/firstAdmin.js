import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/dbconnection';
import moment from 'moment';

const firstAdmin = {
    async createFirstAdmin(req, res){
        const staff = {
            firstname: 'Laetita',
            lastname:'Kabeho',
            email: 'kabehotitia@banka.com',
            password: '$2b$10$fcE1YYsEpqZIdrVW6xbUmeHL5q29UcfMa.I6aKQag1Vqluh2DkpGe',
            type:"staff",
            isadmin: true
        }

        
    
        const query = 'INSERT INTO staff (firstname,lastname,email,password,type,isadmin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [staff.firstname, staff.lastname, staff.email, staff.password, staff.type, staff.isadmin];
        const result =  await db.query(query, values);
        const token = jwt.sign({
            email: staff.email
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
 } 


    

export default firstAdmin;