import {accountData} from '../models/accountsData';
import {transactionData} from '../models/transactionData'
import jwt from 'jsonwebtoken';
import {userData} from '../models/usersData';

const allAccounts = accountData;
const allTransactions= transactionData;
const allUsers = userData;

export default class transaction{

    static debitAccount(req, res){
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
            const staff = allUsers.filter(oneStaff => oneStaff.email == decodedEmail); 
            if(staff[0].isAdmin == true) {
                return res.status(400).json({
                    status :400,
                    message: "You do not have the right to debit a Bank account!"
                });
    
            }
            else {  

        const accountNumb=req.params.accountNumber;
        let toDay = new Date();
        const accounts = allAccounts.filter(account => account.accountNumber == accountNumb);
            if(accounts.length==1){
                if(accounts[0].status ==="draft" || accounts[0].status==="dormant"){
                    return res.status(400).json({
                        status :400,
                        message: "You have to activate this account first"
                    });


                } else {
                    const debit = {
                        id : allTransactions.length + 1,
                        createdOn : toDay,
                        type : "debit",
                        accountNumber : accountNumb,
                        amount : req.body.amount ,
                        oldBalance : accounts[0].balance,
                        newBalance : accounts[0].balance + req.body.amount ,
                    }
                    accounts[0].balance=debit.newBalance;
                    allTransactions.push(debit);
                    let transactionId = debit.id, accountNumber = debit.accountNumber, amount = debit.amount, transactionType = debit.type, accountBalance = debit.newBalance;
                    return res.status(201).json({
                        status :201,
                        data: {transactionId,accountNumber,amount,transactionType,accountBalance}
                    });
                }
            }
            
            if(accounts.length==0){
                return res.status(404).json({
                    status :404,
                    message: "The bank account entered does not exist!"
                });
            }
        } 
        }

        static creditAccount(req, res){

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
            
            const staff = allUsers.filter(oneStaff => oneStaff.email == decodedEmail); 
            if(staff[0].isAdmin == true) {
                return res.status(400).json({
                    status :400,
                    message: "You do not have the right to credit a Bank account!"
                });
    
            }
            else{

            const accountNumb=req.params.accountNumber;
            let toDay = new Date();
            const accounts = allAccounts.filter(account => account.accountNumber == accountNumb);
                if(accounts.length==1){
                    if(accounts[0].status ==="draft" || accounts[0].status==="dormant"){
                        return res.status(400).json({
                            status :400,
                            message: "You have to activate this account first"
                        });
    
    
                    }
                    if(accounts[0].balance < req.body.amount ){
                        return res.status(400).json({
                            status :400,
                            message: "You do not have that amount on your account"
                        });
                    }
                    
                    else {
                        const credit = {
                            id : allTransactions.length + 1,
                            createdOn : toDay,
                            type : "credit",
                            accountNumber : accountNumb,
                            amount : req.body.amount ,
                            oldBalance : accounts[0].balance,
                            newBalance : accounts[0].balance - req.body.amount ,
                        }
                        accounts[0].balance=credit.newBalance;
                        allTransactions.push(credit);
                        let transactionId = credit.id, accountNumber = credit.accountNumber, amount = credit.amount, transactionType = credit.type, accountBalance = credit.newBalance;
                        return res.status(201).json({
                            status :201,
                            data: {transactionId,accountNumber,amount,transactionType,accountBalance}
                        });
                    }
                }
                
                if(accounts.length==0){
                    return res.status(404).json({
                        status :404,
                        message: "The bank account entered does not exist!"
                    });
                }
            
    }
    }

}