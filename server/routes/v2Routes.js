import { Router } from "express";
import users from "../v2/controllers/clientsController";
import accounts from '../v2/controllers/accountController';
import getToken from '../v2/middlewares/authorization';
import employees from '../v2/controllers/staffController';
import admin from '../v2/helpers/firstAdmin';
import transactions from '../v2/controllers/transactionsController'



const myRouter=Router();

// users routes

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);

//bank account routes

myRouter.post('/accounts', getToken, accounts.createAccount);
myRouter.patch('/accounts/:accountNumber', getToken, accounts.updateAccount);
myRouter.delete('/accounts/:accountNumber',getToken, accounts.deleteAccount);
myRouter.get('/user/accounts',getToken,accounts.userAccount);
myRouter.get('/accounts/:accountNumber',getToken,accounts.userFindAccount);
myRouter.get('/accounts',getToken,employees.getAllAccounts);
//staff accounts

myRouter.post('/staff/auth/signup',getToken, employees.registerStaff);
myRouter.post('/staff/auth/signin',employees.loginStaff);


// transaction routes

myRouter.post('/transactions/:accountNumber/debit', getToken, transactions.debitAccount);
myRouter.post('/transactions/:accountNumber/credit', getToken, transactions.creditAccount);
myRouter.get('/accounts/:accountNumber/transactions', getToken, transactions.transactionsHistory);
myRouter.get('/transactions/:transactionId', getToken, transactions.getAtransaction);

//test routes
myRouter.post('/staff/test',admin.createFirstAdmin);








export default myRouter;