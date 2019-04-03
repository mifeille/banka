import {accountData} from '../models/accountsData';

const allAccounts = accountData;

export default class authUsers{
   static getAllAccounts(req, res){
        return res.send({
            status :200,
            data: allAccounts
        })
    };

    static createAccount(req, res){
        try{
            const account = {
                accountNumber:allAccounts.length +1,
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
        catch(err){
            return res.status(400).json({
                status:400,
                message: err.message
            });
        }
    }
}