import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';
import db from '../v2/db/dbconnection';


const { expect } = chai;

chai.use(chaiHttp);

describe('Users', () => {
  it('should be able to fetch all users', (done) => {
    chai.request(server)
      .get('/api/v2/users')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('User signup', () => {

  it('should let a user create a user account with valid credentials', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisari@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let a user create a user account with an email in use', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisari@banka.com',
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
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: '',
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
      .post('/api/v2/auth/signup')
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
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisabanka.com',
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
      .post('/api/v2/auth/signup')
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
      .post('/api/v2/auth/signup')
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
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Patri n',
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
      .post('/api/v2/auth/signup')
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
      .post('/api/v2/auth/signup')
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

  it('should not accept numbers and white spaces in the first name  ', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Patrick',
        lastName: 'Kalis a',
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
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
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
      .post('/api/v2/auth/signup')
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
      .post('/api/v2/auth/signup')
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
      .post('/api/v2/auth/signup')
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
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa11',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('User login', () => {
  it('should log in a user with the right credentials ', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'kalisari@banka.com',
        password: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should not log in user with an integer email ', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 1,
        password: 'kayirangwa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login user without email address', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: '',
        password: 'kayirangwa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login user with an incorrect email address', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'kayirangwa.com',
        password: 'kayirangwa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should not login user with an incorrect password', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'kalisa@banka.com',
        password: 'kalisa!',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login user with no password', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'kayirangwa@banka.com',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
