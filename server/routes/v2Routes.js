import { Router } from "express";
import users from "../v2/controllers/clientsController";



const myRouter=Router();

// users routes

myRouter.get('/users',users.getAll);
myRouter.post('/auth/signup',users.registerUser);
myRouter.post('/auth/signin',users.loginUser);





export default myRouter;