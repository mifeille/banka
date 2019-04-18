import { Router } from "express";
import users from "../controllers/userController";
import accounts from "../controllers/accountController";
import transactions from "../controllers/transactionController";
import getToken from "../middleware/authorization";
import staff from "../controllers/staffController";



const myRouter=Router();

// users routes

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);


// accounts routes

myRouter.get('/accounts',getToken, accounts.getAllAccounts);
myRouter.post('/accounts', getToken, accounts.createAccount);
myRouter.patch('/accounts/:accountNumber', getToken, accounts.updateAccount);
myRouter.delete('/accounts/:accountNumber',getToken, accounts.deleteAccount);
myRouter.get('/user/accounts',getToken, users.getUserAccount);

// transaction routes

myRouter.post('/transactions/:accountNumber/debit', getToken, transactions.debitAccount);
myRouter.post('/transactions/:accountNumber/credit', getToken, transactions.creditAccount);

//admin routes

myRouter.post('/staff/signup',getToken, staff.registerStaff);
myRouter.post('/staff/signin', staff.loginStaff);


export default myRouter;