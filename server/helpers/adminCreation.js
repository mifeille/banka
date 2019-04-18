import {adminData} from '../models/adminData';
import bcrypt from 'bcrypt';

const createAdmin = ()=>{
    const allStaff = adminData;
    const admin = {
        id:1,
        firstName: "Laetita",
        lastName : "Kabeho",
        email: "kabeho@banka.com",
        password : "kabeho1!",
        type: "staff",
        isAdmin: true
    }
    // bcrypt.hash(admin.password, 10, (err, hash) =>{
    //     const admin = {
    //         id:1,
    //         firstName: "Laetita",
    //         lastName : "Kabeho",
    //         email: "kabeho@banka.com",
    //         password : hash,
    //         type: "staff",
    //         isAdmin: true
    //     }
    // });
    allStaff.push(admin);


}

export default createAdmin;