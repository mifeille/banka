import db from '../db/dbconnection';
import jwt from 'jsonwebtoken';

const notifications = {
    async getAllNotifications(req, res) {

        let decodedEmail;
        jwt.verify(req.token,process.env.JWTSECRETKEY,(err,decoded)=>{
            if(err){
                return res.status(403).json({
                    status:403,
                    error:"A token must be provided!"
                });
            }
            decodedEmail = decoded.email;
        });

        const client = 'SELECT * FROM clients WHERE email = $1';
        const findClient = await db.query(client, [decodedEmail]);
        if(findClient.rows == 0) {
            return res.status(400).json({
                status:400,
                message: "You must create a user account first!"
            }); 
        } else {
            const query = 'SELECT clients.email,notifications.createdon,notifications.message FROM clients INNER JOIN notifications ON clients.id=notifications.owner AND clients.email = $1';
            const queryOwner = await db.query(query, [decodedEmail]);
            
            if(queryOwner.rowCount > 0) {
                return res.status(200).json({
                    status :200,
                    data: queryOwner.rows
                });
                
            } else{

                return res.status(400).json({
                    status:400,
                    message: "You have no notification!"
                });
            }
            
        }
    }

}

export default notifications;