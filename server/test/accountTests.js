import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';
import user from '../controllers/userController';
import jwt from 'jsonwebtoken';

let userToken,adminToken,staffToken;

let expect = chai.expect;
chai.use(chaiHttp);

describe('Bank account creation', () => {

  before((done) => {
    chai.request(server)
    .post('/api/v1/auth/signup')
    .send({
      firstName: "Patrick",
      lastName : "Kalima",
      email: "kalimapa@banka.com",
      password: "kalima1!",
      confirmPassword: "kalima1!"
    })
    .end((err, res) => {
      
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      userToken = res.body.data.token;
      done();
    });
  })

  it('should be able to create a bank account', (done) => {   
    chai.request(server)
    .post('/api/v1/accounts')
    .set("Authorization", `Bearer ${userToken}`)
    .send({
        type: "savings"
    })
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an error if the token is not provided', (done) => {   
    chai.request(server)
    .post('/api/v1/accounts')
    .send({
        type: "savings"
    })
    .end((err, res) => {
      expect(res).to.have.status(403);
      expect(res.body).to.be.an('object');
      done();
    });
});


it('should not create a bank account when the account type is empty', (done) => {
    chai.request(server)
    .post('/api/v1/accounts')
    .set("Authorization", `Bearer ${userToken}`)
    .send({
        type: ""
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should fetch a user bank accounts ', (done) => {
    chai.request(server)
    .get('/api/v1/user/accounts')
    .set("Authorization", `Bearer ${userToken}`)
    .send()
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should refuse access to fetch a user bank accounts when a token is not provided ', (done) => {
    chai.request(server)
    .get('/api/v1/user/accounts')
    .send()
    .end((err, res) => {
      expect(res).to.have.status(403);
      expect(res.body).to.be.an('object');
      done();
    });
});
});


describe('Bank account activation and deactivation', () => {

    before((done) => {
      chai.request(server)
      .post('/api/v1/staff/signin')
      .send({
        email: "kabeho@banka.com",
        password: "kabeho1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        adminToken = res.body.data.token;
        done();
      });
    })

    it('should be able to create a staff', (done) => {
        chai.request(server)
        .post('/api/v1/staff/signup')
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            firstName: "Emily",
            lastName : "Benurugo",
            email: "benurugo@banka.com",
            password: "benurugo1!",
            confirmPassword: "benurugo1!",
            isAdmin: "No"
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          staffToken = res.body.data.token;
          done();
        });
    });

    
    it('should let a staff/admin be able to activate or deactivate a bank account', (done) => {
    chai.request(server)
    .patch('/api/v1/accounts/20001555061386016')
    .set("Authorization", `Bearer ${staffToken}`)
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an error when a token is not provided', (done) => {
    chai.request(server)
    .patch('/api/v1/accounts/20001555061386016')
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(403);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an error when sommeone who is not a staff tries to activate or deactivate an account ', (done) => {
    chai.request(server)
    .patch('/api/v1/accounts/20001555061386016')
    .set("Authorization", `Bearer ${staffToken}`)
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an error when the bank account is already activated or dectivated', (done) => {
  chai.request(server)
  .patch('/api/v1/accounts/20001555061386016')
  .set("Authorization", `Bearer ${staffToken}`)
  .send({
      status: "active"
  })
  .end((err, res) => {
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    done();
  });
});

it('should give an error if the bank account to update is not found', (done) => {
    chai.request(server)
    .patch('/api/v1/accounts/200155506138601600')
    .set("Authorization", `Bearer ${staffToken}`)
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should let a staff/admin delete a specific bank account', (done) => {
  chai.request(server)
  .delete('/api/v1/accounts/20001555061386016')
  .set("Authorization", `Bearer ${adminToken}`)
  .send()
  .end((err, res) => {
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    done();
  });
});

it('should let admin to fetch all bank accounts', (done) => {
    chai.request(server)
    .get('/api/v1/accounts')
    .set("Authorization", `Bearer ${adminToken}`)
    .send()
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an erron when a right token is not provided', (done) => {
    chai.request(server)
    .delete('/api/v1/accounts/20001555061386016')
    .send()
    .end((err, res) => {
      expect(res).to.have.status(403);
      expect(res.body).to.be.an('object');
      done();
    });
  });

it('should notify the staff/admin when the bank account to delete is not found', (done) => {
  chai.request(server)
  .delete('/api/v1/accounts/2000155506138601600')
  .set("Authorization", `Bearer ${adminToken}`)
  .send()
  .end((err, res) => {
    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    done();
  });
});

  it('should give an error when someone who is not an admin tries to delete an account', (done) => {
    chai.request(server)
    .delete('/api/v1/accounts/20001555061386016')
    .set("Authorization", `Bearer ${staffToken}`)
    .send()
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
  });
 })