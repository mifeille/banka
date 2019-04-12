import { Router } from "express";
import users from "../controllers/userController";
import accounts from "../controllers/accountController";
import transactions from "../controllers/transactionController";



const myRouter=Router();

// users routes

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);

// accounts routes

myRouter.get('/accounts',accounts.getAllAccounts);
myRouter.post('/accounts',accounts.createAccount);
myRouter.patch('/accounts/:accountNumber',accounts.updateAccount);
myRouter.delete('/accounts/:accountNumber',accounts.deleteAccount);

// transaction routes

myRouter.post('/transactions/:accountNumber/debit',transactions.debitAccount);
myRouter.post('/transactions/:accountNumber/credit',transactions.creditAccount);

export default myRouter;