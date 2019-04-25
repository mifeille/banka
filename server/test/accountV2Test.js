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
  it('It Should let an admin log in with right signin credentials', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signin')
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

  it('It Should let an admin create a staff with right signup credentials', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Chantal',
        lastName: 'Mahoro',
        email: 'mahoro1@banka.com',
        password: 'mahoro1!',
        confirmPassword: 'mahoro1!',
        isadmin: 'No',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        cashierToken = res.body.data.token;
        done();
      });
  });

  it('should let an admin be able to activate or deactivate a bank account', (done) => {
    chai.request(server)
      .patch(`/api/v2/accounts/${accountnumb}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'active',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
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

  it('should give an error when sommeone who is not a staff tries to activate or deactivate an account ', (done) => {
    chai.request(server)
      .patch('/api/v2/accounts/2000155506')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        status: 'active',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error when the bank account is already activated or dectivated', (done) => {
    chai.request(server)
      .patch(`/api/v2/accounts/${accountnumb}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'active',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error when the status is not provided', (done) => {
    chai.request(server)
      .patch(`/api/v2/accounts/${accountnumb}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should give an error when the status is not acive or domant', (done) => {
    chai.request(server)
      .patch(`/api/v2/accounts/${accountnumb}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'activve',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error if the bank account to update is not found', (done) => {
    chai.request(server)
      .patch('/api/v2/accounts/200155506138601600')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'active',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should let admin to fetch all bank accounts', (done) => {
    chai.request(server)
      .get('/api/v2/accounts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
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

  it('should notify the admin when the bank account to delete is not found', (done) => {
    chai.request(server)
      .delete('/api/v2/accounts/2000155506')
      .set('Authorization', `Bearer ${adminToken}`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error when someone who is not an admin tries to delete an account', (done) => {
    chai.request(server)
      .delete('/api/v2/accounts/20001555061')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
describe('Credit a bank account', () => {
  it('should let a cashier credit a bank account', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/credit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        amount: 45000,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });

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
  it('should give an error if the amount is not provided', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/credit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({     
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
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

  it('should not credit a draft or dormant account', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${account2}/credit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        amount: 45000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error when the bank account is not found', (done) => {
    chai.request(server)
      .post('/api/v2/transactions/10001555061/credit')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        amount: 45000,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('Debit a bank account', () => {
  it('should be able to debit a bank account', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/debit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });

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
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not credit a dormant or draft bank account ', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${account2}/debit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not debit a bank account with no enough amount', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/debit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        amount: 400000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error if the bank account is not found', (done) => {
    chai.request(server)
      .post('/api/v2/transactions/200015550633436/debit')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        amount: 40000,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should give an error if the amount is not provided', (done) => {
    chai.request(server)
      .post(`/api/v2/transactions/${accountnumb}/debit`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should let an admin delete a bank account', (done) => {
    chai.request(server)
      .delete(`/api/v2/accounts/${account2}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should give an erron when someone who is not an admin tries to delete an account', (done) => {
    chai.request(server)
      .delete(`/api/v2/accounts/${account2}`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('should give an error if the bank to delete has money on it', (done) => {
    chai.request(server)
      .delete(`/api/v2/accounts/${accountnumb}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
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
  it('should retrieve notifications', (done) => {
    chai.request(server)
      .get('/api/v2/notifications')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
