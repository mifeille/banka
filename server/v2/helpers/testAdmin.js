import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/dbconnection';

const authAdmin = {
  async registerAdmin(req, res) {
    const hash = bcrypt.hashSync(process.env.PASSWORD_TEST, 10);
    const user = {
      firstname: 'Aurore',
      lastname: 'Kayitesire',
      email: process.env.EMAIL_TEST,
      password: hash,
      type: 'staff',
      isadmin: true,
    };

    const query = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [
      user.firstname, user.lastname, user.email, user.password, user.type, user.isadmin];
    const result = await db.query(query, values);
    const token = jwt.sign({
      id: result.rows[0].id,
      email: result.rows[0].email,
      firstname: result.rows[0].firstname,
      lastname: result.rows[0].lastname,
      type: result.rows[0].type,
      isadmin: result.rows[0].isadmin,
    }, process.env.JWTSECRETKEY,
    {
      expiresIn: '3h',
    });
    return token;
  },
};
export default authAdmin;
