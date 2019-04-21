import { Router } from "express";
import users from "../v2/controllers/clientsController";
import accounts from '../v2/controllers/accountController';
import getToken from '../v2/middlewares/authorization';
import employees from '../v2/controllers/staffController';
import admin from '../v2/helpers/firstAdmin';



const myRouter=Router();

// users routes

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);

//bank account routes

myRouter.post('/accounts', getToken, accounts.createAccount);
myRouter.patch('/accounts/:accountNumber', getToken, accounts.updateAccount);

//staff accounts

myRouter.post('/staff/auth/signup',getToken, employees.registerStaff);
myRouter.post('/staff/auth/signin',employees.loginStaff);

//test routes
myRouter.post('/staff/test',admin.createFirstAdmin);








export default myRouter;