import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';
import db from '../v2/db/dbconnection';

const expect = chai.expect;
let adminToken; let  
cashierToken;
chai.use(chaiHttp);


describe('User signup', () => {
  it('It Should let an admin sign in with the right log in credentials', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: process.env.superUserEmail,
        password: process.env.superUserPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        adminToken = res.body.data.token;
        done();
      });
  });
  it('should let an admin create a staff account ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'mahorocha@banka.com',
        password: 'kalisa11',
        confirmPassword: 'kalisa11',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        cashierToken = res.body.data.token;
        done();
      });
  });
  it('should give access to create staff account to admin only  ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa11',
        confirmPassword: 'kalisa11',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should not register a new staff with an already existing email', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'mahorocha@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register a user with an empty email field', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register a user with an integer email ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 2,
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register user with a wrong email format', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisaabanka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register user with an empty First Name field ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: '',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register user with an integer as First Name ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 1,
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not accept numbers and white spaces in the first name   ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Patri 1',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register a user with an empty Last Name field ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: '',
        email: 'kalisa@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register user with an integer as Last Name ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Patrick',
        lastName: 1,
        email: 'kalisa@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not accept numbers and white spaces in the last name ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Patrick',
        lastName: 'Kalis1',
        email: 'kalisa@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register a user without password', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: '',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not allow white spaces in the password', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa 1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should register a password that has at least 6 characters ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'sa1!',
        confirmPassword: 'sa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error when password and confirm password do not match  ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa1',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not register a user without confirming his password  ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa11',
        confirmPassword: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error when the token is not provided  ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa11',
        confirmPassword: 'kalisa11',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not log in staff with an integer email ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signin')
      .send({
        email: 1,
        password: 'kabeho1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login staff without email address', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signin')
      .send({
        email: '',
        password: 'kabeho1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should not login staff with an incorrect email or password', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'kabehola@banka.com',
        password: 'kabeho1',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login user if the email is not registered', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signin')
      .send({
        email: 'kay@banka.com',
        password: 'kalima1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login user with no password', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signin')
      .send({
        email: 'kabehotitia@banka.com',

      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
