import validator from 'validator';

export default class validateAcc {
static validateAccount (req, res){
    
    if (validator.isEmpty(req.body.type)) {
       
        throw Error("The bank account type is required"); 
    } else {
        return true;
    }
}
}