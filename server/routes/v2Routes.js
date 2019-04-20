import { Router } from "express";
import users from "../v2/controllers/clientsController";
import accounts from '../v2/controllers/accountController';
import getToken from '../v2/middlewares/authorization'



const myRouter=Router();

// users routes

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);

//account routes

myRouter.post('/accounts', getToken, accounts.createAccount);





export default myRouter;