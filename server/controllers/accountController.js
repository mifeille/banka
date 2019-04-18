import {accountData} from '../models/accountsData';
import {userData} from '../models/usersData';
import validation from '../helpers/accountValidation';
import jwt from 'jsonwebtoken';
import {adminData} from '../models/adminData';

const allAccounts = accountData;
const allUsers=userData;
const allAdmins = adminData;

export default class authUsers{
   static getAllAccounts(req, res){
    let decodedEmail;
    jwt.verify(req.token,process.env.JWTSECRETKEY,(err,decoded)=>{
        if(err){
            return res.status(403).json({
                status:403,
                error:"A token must to be provided!"
            });
        }
        decodedEmail = decoded.email;
    });
    
    const admins = allUsers.filter(user => user.email == decodedEmail); 
    if(admins[0].isAdmin !== true) {
         return res.status(400).json({
                status:400,
                 message: "You do not have the right to view all bank accounts"
            });
    }
    if(admins[0].isAdmin == true) { 
        return res.send({
            status :200,
            data: allAccounts
        })
    };
   }
    static createAccount(req, res){
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
                const oneUser = allUsers.filter(user =>user.email==decodedEmail);
                let today = new Date();
                let bankAccount = oneUser[0].id + "000" + Date.now();
                const account = {
                    accountNumber:parseInt(bankAccount),
                    createdOn: today,
                    owner: oneUser[0].id,
                    type: req.body.type,
                    status:"draft",
                    openingBalance:0,
                    balance:0
                }
                allAccounts.push(account);
                let accountNumber=account.accountNumber,firstName=oneUser[0].firstName,lastName=oneUser[0].lastName,email=account.email,type=account.type,status=account.status,openingBalance=account.openingBalance;
                res.status(201).json({
                    status :201,
                    message:"Bank account created successfully",
                    data: {accountNumber,firstName,lastName,email,type,status,openingBalance}
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

    static updateAccount(req, res){
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
            const accountNumber=req.params.accountNumber;
            const accounts = allAccounts.filter(account => account.accountNumber == accountNumber);
            const staff = allUsers.filter(oneStaff => oneStaff.email == decodedEmail);
            if(accounts.length ==0) {
                return res.status(404).json({
                    status:404,
                    message: "Bank account not found"
                });
            }
            if(staff[0].type === "staff") {  
                console.log(accounts);
                if(accounts[0].status === req.body.status){
                    return res.status(400).json({
                        status :400,
                        message: `This account is already ${req.body.status}`
                    });
                }
                if(accounts.length ==1 ) {
                    for(let i=0; i<allAccounts.length; i++){
                        if(allAccounts[i].accountNumber == accountNumber){
                            allAccounts[i].status = req.body.status;
                        }
                    }
                    let accountNumb=accounts[0].accountNumber,firstName=staff[0].firstName,lastName=staff[0].lastName,email=accounts[0].email,type=accounts[0].type,status=accounts[0].status,openingBalance=accounts[0].openingBalance;
                    return res.status(200).json({
                        status :200,
                        data: {accountNumb,firstName,lastName,email,type,status,openingBalance}
                    });
                } 
            } else {
                return res.status(400).json({
                    status:400,
                    message: "Only an admin or staff can activate or deactivate a Banka account!"
                });
            }
        }

    static deleteAccount(req, res){
        let decodedEmail;
            jwt.verify(req.token,process.env.JWTSECRETKEY,(err,decoded)=>{
                if(err){
                    return res.status(403).json({
                        status:403,
                        error:"A token must to be provided!"
                    });
                }
                decodedEmail = decoded.email;
            });
            
            const admins = allUsers.filter(user => user.email == decodedEmail); 
            if(admins[0].isAdmin !== true) {
                 return res.status(400).json({
                        status:400,
                         message: "You do not have the right to delete this account"
                    });
            }
            if(admins[0].isAdmin == true) {  
                const accountNumber=req.params.accountNumber;
                const accounts = allAccounts.filter(account => account.accountNumber == accountNumber);
                if(accounts.length==1){
                    const index = allAccounts.indexOf(accounts[0]);
                    allAccounts.splice(index, 1);
                        return res.status(200).json({
                            status :200,
                            message:"Bank account successfully deleted"
                        });
                    } else {
                        return res.status(404).json({
                            status:404,
                            message: "Bank account entered not found"
                        });
                    }
                } else {
                    return res.status(400).json({
                        status:400,
                         message: "You do not have the right to delete this account"
                    });
                }
            }
        }