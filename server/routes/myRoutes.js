import { Router } from "express";
import users from "../controllers/userController";
import accounts from "../controllers/accountController";



const myRouter=Router();

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);
myRouter.get('/accounts',accounts.getAllAccounts);
myRouter.post('/accounts',accounts.createAccount);
myRouter.patch('/account/:accountNumber',accounts.updateAccount);
myRouter.delete('/accounts/:accountNumber',accounts.deleteAccount);

export default myRouter;