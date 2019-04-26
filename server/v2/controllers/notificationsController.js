import jwt from 'jsonwebtoken';
import db from '../db/dbconnection';

const notifications = {
  async getAllNotifications(req, res) {
    const client = 'SELECT * FROM users WHERE email = $1';
    const findClient = await db.query(client, [req.user.email]);
    if (findClient.rows === 0) {
      return res.status(403).json({
        status: 403,
        message: 'You must create a user account first!',
      });
    }
    const query = 'SELECT users.email,notifications.createdon,notifications.message FROM users INNER JOIN notifications ON users.id=notifications.owner AND users.email = $1';
    const queryOwner = await db.query(query, [req.user.email]);

    if (queryOwner.rowCount > 0) {
      return res.status(200).json({
        status: 200,
        data: queryOwner.rows,
      });
    }

    return res.status(400).json({
      status: 400,
      message: 'You have no notification!',
    });
  },

};

export default notifications;
