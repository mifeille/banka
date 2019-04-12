import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let expect = chai.expect;
chai.use(chaiHttp);

describe('Users', () => {
  it('should be able to fetch all users', (done) => {
    chai.request(server)
    .get('/api/v1/users')
    .send()
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      done();
    });
});
})

describe('User signup', () => {

  it('should not register a user with an empty email field', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Richard",
      lastName : "Kalisa",
      email: "",
      password: "kalisa1!",
      confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

  it('should not register a user with an integer email ', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Richard",
      lastName : "Kalisa",
      email: 2,
      password: "kalisa1!",
      confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('It Should create a user with right signup credentials', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send(
    {
      firstName: "Richard",
      lastName : "Kalisa",
      email: "kalisa@banka.com",
      password: "kalisa1!",
      confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should not register a new user with an already existing email', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send({
    firstName: "Richard",
    lastName : "Kalisa",
    email: "kalima@banka.com",
    password: "kalisa1!",
    confirmPassword: "kalisa1!"
  })
  .end((err, res) => {
    expect(res).to.have.status(409);
    expect(res.body).to.be.an('object');
    done();
  });
});
        
it('should not register user with a wrong email format', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send({
    firstName: "Richard",
    lastName : "Kalisa",
    email: "kalisabanka.com",
    password: "kalisa1!",
    confirmPassword: "kalisa1!"
  })
  .end((err, res) => {
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    done();
  });
});

it('should not register user with an empty First Name field ', (done) => {
  chai.request(server)
  .post('/api/v1/auth/signup')
  .send(
    {
      firstName: "",
      lastName : "Kalisa",
      email: "kalisa@banka.com",
      password: "kalisa1!",
      confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });
  
  it('should not register a user with an empty Last Name field ', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Richard",
      lastName : "",
      email: "kalisa@banka.com",
      password: "kalisa1!",
      confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });

  it('should not register a user without password', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send( 
      {
        firstName: "Richard",
        lastName : "Kalisa",
        email: "kalisa@banka.com",
        password: "",
        confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
      });
  });

  it('should not allow white spaces in the password', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send( 
      {
        firstName: "Richard",
        lastName : "Kalisa",
        email: "kalisa@banka.com",
        password: "kalisa 1!",
        confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
      });
  });
  
  it('should register a password that has at least 6 characters ', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Richard",
      lastName : "Kalisa",
      email: "kalisa@banka.com",
      password: "sa1!",
      confirmPassword: "sa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });
  
  it('should give an error when password and confirm password do not match  ', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Richard",
      lastName : "Kalisa",
      email: "kalisa@banka.com",
      password: "kalisa1",
      confirmPassword: "kalisa1!"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });

  it('should not register a user without confirming his password  ', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Richard",
      lastName : "Kalisa",
      email: "kalisa@banka.com",
      password: "kalisa11",
      confirmPassword: ""
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });
});


describe('User login', () => {
  it('should login a user without the correct credentials', (done) => {
    chai.request(server)
    .post('/api/v1/auth/signin')
    .send(
      {
        email: "kalima@banka.com",
        password : "kalima1!"
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not log in user with an integer email ', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: 1,
        password : "kalima1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not login user without email address', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: "",
        password : "kalima1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    it('should not login user with an incorrect email address', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: "kalimabanka.com",
        password : "kalima1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not login user with an incorrect email or password', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({ 
        email: "kalima@banka.com",
        password : "kalim1"})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not login user if the email is not registered', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({ 
        email: "kalim@banka.com",
        password : "kalima1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
    });

    it('should not login user with no password', (done) => {
      chai.request(server)
      .post('/api/v1/auth/signin')
      .send({ 
        email: "kalim@banka.com",
        password : ""
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    });
        