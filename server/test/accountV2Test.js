import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';


let userToken; let accountnumb; let adminToken; let
  cashierToken; let account2;

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

  it('should give an erron when a right token is not provided', (done) => {
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
