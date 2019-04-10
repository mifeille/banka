import {accountData} from '../models/accountsData';
import {userData} from '../models/usersData'
import validation from '../helpers/accountValidation'

const allAccounts = accountData;
const allUsers=userData;

export default class authUsers{
   static getAllAccounts(req, res){
        return res.send({
            status :200,
            data: allAccounts
        })
    };

    static createAccount(req, res){
        try{
            if(validation.validateAccount(req, res)){
                const users = allUsers.filter(user => user.email == req.body.email);
                if(users.length < 1){
                   return res.status(404).json({
                        status:404,
                        message: "Email not found"
                    });
                } else{
                    let bankAccount = users[0].id + "000" + Date.now();
                    console.log(bankAccount);
                    const account = {
                        accountNumber:parseInt(bankAccount),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        type: req.body.type,
                        Status:"draft",
                        openingBalance:0
                    }
                    allAccounts.push(account);
                    let accountNumber=account.accountNumber,firstName=account.firstName,lastName=account.lastName,email=account.email,type=account.type,status=account.status,openingBalance=account.openingBalance;
                    res.status(201).json({
                        status :201,
                        data: {accountNumber,firstName,lastName,email,type,status,openingBalance}
                    });
                }
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
        try{
            const accountNumber=req.params.accountNumber;
            const accounts = allAccounts.filter(account => account.accountNumber == accountNumber);
            if(accounts[0].status === req.body.status){
                return res.status(400).json({
                    status :400,
                    message: `This account is already ${req.body.status}`
                });
            }
            if(accounts.length==1){
                accounts[0].status=req.body.status;
            
                let accountNumb=accounts[0].accountNumber,firstName=accounts[0].firstName,lastName=accounts[0].lastName,email=accounts[0].email,type=accounts[0].type,status=accounts[0].status,openingBalance=accounts[0].openingBalance;
                return res.status(200).json({
                    status :200,
                    data: {accountNumb,firstName,lastName,email,type,status,openingBalance}
                });
            }
        }
        catch(err){
            return res.status(404).json({
                status:404,
                message: "Bank account not found"
            });
        }
    }

    static deleteAccount(req, res){
        const accountNumber=req.params.accountNumber;
        const accounts = allAccounts.filter(account => account.accountNumber == accountNumber);
        if(accounts.length==1){
            delete allAccounts[accountNumber-1];
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
     }
}