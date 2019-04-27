import chaiHttp from 'chai-http';
import chai from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../server';
import pool from '../v2/db/dbconnection';
import tokenA from '../v2/helpers/testAdmin';

dotenv.config();


let userToken; let accountnumb; let
  cashierToken; let account2;

const adminToken = jwt.sign({
  id: 1,
  email: 'kabehola@banka.com',
  firstname: 'Laetitia',
  lastname: 'Kabeho',
  type: 'staff',
  isadmin: true,
}, process.env.JWTSECRETKEY,
{
  expiresIn: '3h',
});

const expect = chai.expect;
chai.use(chaiHttp);

describe('Bank account creation', () => {
  it('should let a user create a user account with valid credentials', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisaa@banka.com',
        password: 'kalisaa1!',
        confirmPassword: 'kalisaa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        userToken = res.body.data.token;
        done();
      });
  });
  it('should be able to create a bank account', (done) => {
    chai.request(server)
      .post('/api/v2/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'savings',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        accountnumb = res.body.data.accountnumber;
        done();
      });
  });

  it('should be able to create a bank account', (done) => {
    chai.request(server)
      .post('/api/v2/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'savings',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        account2 = res.body.data.accountnumber;
        done();
      });
  });

  it('should give an error if the token is not provided', (done) => {
    chai.request(server)
      .post('/api/v2/accounts')
      .send({
        type: 'savings',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should only accept savings and current as bank account type', (done) => {
    chai.request(server)
      .post('/api/v2/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'savingjdhs',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error if the type is not provided', (done) => {
    chai.request(server)
      .post('/api/v2/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should fetch a user bank accounts ', (done) => {
    chai.request(server)
      .get('/api/v2/user/accounts')
      .set('Authorization', `Bearer ${userToken}`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should refuse access to fetch a user bank accounts when a token is not provided ', (done) => {
    chai.request(server)
      .get('/api/v2/user/accounts')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('Bank account activation and deactivation', () => {
  before((done) => {
    const hash = bcrypt.hashSync(process.env.PASSWORD, 10);
    const firstAdmin = 'INSERT INTO users (firstname,lastname,email,password,type,isadmin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING';
    const value = ['Laetitia', 'Kabeho', process.env.EMAIL, hash, 'staff', 'true'];
    pool.query(firstAdmin, value);
    done();
  });
  it('It Should create a user with right signup credentials', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisarichardo@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
        isadmin: 'No',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        console.log(adminToken);
        cashierToken = res.body.data.token;
        done();
      });
  });
  it('should give an error when a token is not provided', (done) => {
    chai.request(server)
      .patch('/api/v2/accounts/20001555061386016')
      .send({
        status: 'active',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });


  it('should give an error when a right token is not provided', (done) => {
    chai.request(server)
      .delete('/api/v2/accounts/200015550')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error when someone who is not an admin tries to delete an account', (done) => {
    chai.request(server)
      .delete('/api/v2/accounts/20001555061')
      .set('Authorization', `Bearer ${userToken}`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
describe('Credit a bank account', () => {
  it('should give an error if a token is not provided', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/credit`)
      .send({
        amount: 45000,
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let only a cashier credit an account', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/credit`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        amount: 45000,
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('Debit a bank account', () => {
  it('should give an error when a token is not provided', (done) => {
    chai.request(server)
      .post('/api/v2/transactions/10001555061257616/debit')
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should let only a cashier debit a bank account', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/debit`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should give an erron when someone who is not an admin tries to delete an account', (done) => {
    chai.request(server)
      .delete(`/api/v2/accounts/${account2}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
describe('Notifications', () => {
  it('should give an error if the token is not provided', (done) => {
    chai.request(server)
      .get('/api/v2/notifications')
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
