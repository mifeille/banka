import validation from '../helpers/accountValidation';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import db from '../db/dbconnection'


const accounts = {

    async createAccount(req, res){
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

        try{
            if(validation.validateAccount(req, res)){
                const user = 'SELECT * FROM clients WHERE email = $1';
                const value = [decodedEmail];
                const { rows} = await db.query(user, value);
                
                if(!rows) {
                    return res.status(404).json({
                        status:404,
                        message: 'Create a user account first!'
                    }); 
                }
                let bankAccount = rows[0].id +''+ Date.now();
                const account = {
                    accountnumber:parseInt(bankAccount),
                    createdon: moment(new Date()),
                    owner: rows[0].id,
                    type: req.body.type,
                    status:"draft",
                    openingbalance:0,
                    balance:0
                }
                const query = 'INSERT INTO accounts (accountnumber,createdon,owner,type,status,openingbalance,balance) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
                const values = [account.accountnumber,account.createdon,account.owner,account.type,account.status,account.openingbalance,account.balance];
                const result = await db.query(query, values);
                let accountnumber = account.accountnumber,firstName = rows[0].firstname,lastName = rows[0].lastname,email = account.email,type = account.type,status = account.status,openingBalance = account.openingbalance;
                res.status(201).json({
                    status :201,
                    message:"Bank account created successfully",
                    data: {accountnumber,firstName,lastName,email,type,status,openingBalance}
                });
            }
        } catch(err){
            return res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }
}

export default accounts;