import validator from 'validator';
import {userData} from '../models/accountsData';

export default class validateAcc {
static validateAccount (req, res){
    
    if (validator.isEmpty(req.body.type)) {
       
        throw Error("The bank account type is required"); 
    }

    if (validator.isEmpty(req.body.email)) {
       
        throw Error("Email is required");
    } else {
        return true;
    }
}
}