import validator from 'validator';
import {userData} from '../models/usersData';

export default class validateUser {

    static validateSignup (req, res){
        const allUsers = userData;
        let whiteSpace = /\s/;
        let validLetters = /^[A-Za-z]+$/;

        if (typeof req.body.firstName ==='number') {
            
            throw Error("First Name should not be a number");
        }

        if (validator.isEmpty(req.body.firstName)) {
           
            throw Error("First Name is required"); 
        }

        if (!validLetters.test(req.body.firstName)) {
           
            throw Error("First Name should contain only letters"); 
        }

        if (typeof req.body.lastName ==='number') {
            
            throw Error("Last Name should not be a number");
        }

        if (validator.isEmpty(req.body.lastName)) {
           
            throw Error("Last Name is required");
        }

        if (!validLetters.test(req.body.lastName)) {
           
            throw Error("Last Name should contain only letters"); 
        }

        if (typeof req.body.email ==='number') {
            
            throw Error("Wrong format, email should not be an integer");
        }

        if (validator.isEmpty(req.body.email)) {
            
            throw Error("Email should not be empty");
        }
        
        if (!validator.isEmail(req.body.email)) {

            throw Error("Your email should look like this : example@email.com");
        }
    
        if (validator.isEmpty(req.body.password)) {
            throw Error("Password is required");
        }

        if(whiteSpace.test(req.body.password)) {
            throw Error("Password should not contain white spaces");
        }

        if (!validator.isLength(req.body.password, {
            min: 6, max: 50
        })) {
            throw Error("Password should be at least 6 characters");
        }
        if (validator.isEmpty(req.body.confirmPassword)) {
            throw Error("Please confirm your password");
        }
        
        if (!validator.equals(req.body.password, req.body.confirmPassword)) {
            throw Error("Passwords do not match");
        }
        else {
            
        }
            return true;
    }
        
        
    static validateLogin (req, res){

        if (typeof req.body.email == "number") {
            throw Error("Wrong format, email should not be an integer");
        }

        if (validator.isEmpty(req.body.email)) {
            throw Error("Email should not be empty");
        }
        
       
        if (!validator.isEmail(req.body.email)) {
            throw Error("Your email should look like this : example@email.com");
        }
        if (validator.isEmpty(req.body.password)) {
            throw Error("Password is required");
        }
        return true;
    }
    
}
