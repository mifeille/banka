import { Router } from "express";
import users from "../controllers/userController";



const myRouter=Router();

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);


export default myRouter;