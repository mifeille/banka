import jwt from 'jsonwebtoken';
import moment from 'moment';
import db from '../db/dbconnection'

const transaction = {

    async debitAccount(req, res){
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
        const cashier = 'SELECT * FROM staff WHERE email = $1';
        const findCashier = await db.query(cashier, [decodedEmail]);
        if(findCashier.rows == 0) {
                return res.status(400).json({
                    status:400,
                    message: "Only a cashier can debit a Bank account!"
                }); 
            }   
        if(findCashier.rows[0].isadmin == 'true') {
            return res.status(400).json({
                status :400,
                message: "Only a cashier can debit a Bank account!"
            });

        } else { 
            const accountNumb = req.params.accountNumber;
            const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
            const accountDebit = await db.query(account, [accountNumb]);
                    
            if(!accountDebit.rows) {
                return res.status(404).json({
                    status:404,
                    message: "Bank account not found"
                }); 
            }
            if(accountDebit.rows){
                if(accountDebit.rows[0].status === "draft" || accountDebit.rows[0].status==="dormant"){
                    return res.status(400).json({
                        status :400,
                        message: "You have to activate this account first"
                    });
                } else {

                    const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
                    const findAccount = await db.query(account, [accountNumb]);
                    console.log( findAccount.rows);
                    const debit = {
                        createdon : moment(new Date()),
                        type : "debit",
                        accountnumber : accountNumb,
                        amount : req.body.amount ,
                        oldbalance : findAccount.rows[0].balance,
                        newbalance : parseFloat (findAccount.rows[0].balance)+ parseFloat(req.body.amount) ,
                    }
                    console.log(debit.newbalance);
                    const transaction = 'INSERT INTO transactions (createdon,type,accountnumber,amount,oldbalance,newbalance)VALUES ($1, $2, $3, $4, $5, $6)';
                    const accountTransation = await db.query(transaction, [debit.createdon,debit.type,debit.accountnumber,debit.amount,debit.oldbalance,debit.newbalance]);
                    const accountUpdate = 'UPDATE accounts SET balance =$1 WHERE accountnumber = $2';
                    const accountDebit = await db.query(accountUpdate, [debit.newbalance, accountNumb]);

                    let accountNumber = debit.accountnumber, amount = debit.amount, transactionType = debit.type, accountBalance = debit.newbalance, cashier = (findCashier.rows[0].firstname +' ' +findCashier.rows[0].lastname);
                    return res.status(201).json({
                        status :201,
                        message : 'Transaction sucessful',
                        data: {accountNumber,amount,cashier,transactionType,accountBalance}
                    });
                }
            }
        } 
    },

    async creditAccount(req, res){

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

        const cashier = 'SELECT * FROM staff WHERE email = $1';
        const findCashier = await db.query(cashier, [decodedEmail]);
        if(findCashier.rows == 0) {
                return res.status(400).json({
                    status:400,
                    message: "Only a cashier can credit a Bank account!"
                }); 
            }   
        if(findCashier.rows[0].isadmin == 'true') {
            return res.status(400).json({
                status :400,
                message: "Only a cashier can credit a Bank account!"
            });

        } else {
            const accountNumb = req.params.accountNumber;
            const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
            const accountCredit = await db.query(account, [accountNumb]);
                    
            if(!accountCredit.rows) {
                return res.status(404).json({
                    status:404,
                    message: "Bank account not found"
                }); 
            }
            console.log(accountNumb);
            if(accountCredit.rows){
                if(accountCredit.rows[0].status ==="draft" || accountCredit.rows[0].status==="dormant"){
                    return res.status(400).json({
                        status :400,
                        message: "You have to activate this account first"
                    });
                }
                
                if(accountCredit.rows[0].balance < req.body.amount ){
                    return res.status(400).json({
                        status :400,
                        message: "You do not have that amount on your account"
                    });
                } else {
                    const account = 'SELECT * FROM accounts WHERE accountnumber = $1';
                    const accountC = await db.query(account, [accountNumb]);
                    const credit = {
                        createdon : moment(new Date()),
                        type : "credit",
                        accountnumber : accountNumb,
                        amount : req.body.amount ,
                        oldbalance : accountC.rows[0].balance,
                        newbalance : parseFloat(accountC.rows[0].balance) - parseFloat(req.body.amount),
                    }

                    const transaction = 'INSERT INTO transactions (createdon,type,accountnumber,amount,oldbalance,newbalance)VALUES ($1, $2, $3, $4, $5, $6)';
                    const accountTransation = await db.query(transaction, [credit.createdon,credit.type,credit.accountnumber,credit.amount,credit.oldbalance,credit.newbalance]);

                    const accountUpdate = 'UPDATE accounts SET balance =$1 WHERE accountnumber = $2';
                    const accountCredit = await db.query(accountUpdate, [credit.newbalance, credit.accountnumber]);

                    let accountNumber = credit.accountnumber, amount = credit.amount, transactionType = credit.type, accountBalance = credit.newbalance, cashier = (findCashier.rows[0].firstname +' ' +findCashier.rows[0].lastname);
                    return res.status(201).json({
                        status :201,
                        message : 'Transaction sucessful',
                        data: {accountNumber,amount,cashier,transactionType,accountBalance}
                    });
                }
            }
                
        }
    }

}

export default transaction;