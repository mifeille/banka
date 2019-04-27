import { Router } from 'express';
import users from '../v2/controllers/clientsController';
import accounts from '../v2/controllers/accountController';
import authorization from '../v2/middlewares/authorization';
import employees from '../v2/controllers/staffController';
import transactions from '../v2/controllers/transactionsController';
import notifications from '../v2/controllers/notificationsController';


const myRouter = Router();

// users routes

myRouter.get('/users', users.getAll);
myRouter.post('/auth/signup', users.registerUser);
myRouter.post('/auth/signin', users.loginUser);

// bank account routes

myRouter.post('/accounts', authorization, accounts.createAccount);
myRouter.patch('/accounts/:accountNumber', authorization, accounts.updateAccount);
myRouter.delete('/accounts/:accountNumber', authorization, accounts.deleteAccount);
myRouter.get('/user/accounts', authorization, accounts.userAccount);
myRouter.get('/accounts/:accountNumber', authorization, accounts.userFindAccount);
myRouter.get('/accounts', authorization, employees.getAllAccounts);
myRouter.get('/accounts?status=active', authorization, employees.getAllAccounts);
myRouter.get('/accounts?status=dormant', authorization, employees.getAllAccounts);
myRouter.get('/accounts?status=draft', authorization, employees.getAllAccounts);
myRouter.get('/user/:emailAddress/accounts', authorization, employees.getUserAccounts);

// staff accounts

myRouter.post('/staff/auth/signup', authorization, employees.registerStaff);

// transaction routes

myRouter.post('/transactions/:accountNumber/debit', authorization, transactions.debitAccount);
myRouter.post('/transactions/:accountNumber/credit', authorization, transactions.creditAccount);
myRouter.get('/accounts/:accountNumber/transactions', authorization, transactions.transactionsHistory);
myRouter.get('/transactions/:transactionId', authorization, transactions.getAtransaction);

// notifications routes

myRouter.get('/notifications', authorization, notifications.getAllNotifications);

export default myRouter;
