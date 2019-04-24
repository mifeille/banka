import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let userToken; let adminToken; let 
 staffToken;

const expect = chai.expect;
chai.use(chaiHttp);

describe('Debit a bank account', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/staff/signin')
      .send({
        email: 'kabeho@banka.com',
        password: 'kabeho1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        adminToken = res.body.data.token;
        done();
      });
  });

  it('should be able to create a staff', (done) => {
    chai.request(server)
      .post('/api/v1/staff/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Emily',
        lastName: 'Benurugo',
        email: 'benurugoe@banka.com',
        password: 'benurugo1!',
        confirmPassword: 'benurugo1!',
        isAdmin: 'No',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        staffToken = res.body.data.token;
        done();
      });
  });

  it('should let a staff debit a bank account', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/10001555061257616/debit')
      .set('Authorization', `Bearer ${staffToken}`)
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
      .post('/api/v1/transactions/10001555061257616/debit')
      .send({
        amount: 45000,
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should let only a cashier debit an account', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/10001555061257616/debit')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: 45000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not debit a draft or dormant account', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/10001555061305898/debit')
      .set('Authorization', `Bearer ${staffToken}`)
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
      .post('/api/v1/transactions/100015550613058/debit')
      .set('Authorization', `Bearer ${staffToken}`)
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

describe('Credit a bank account', () => {
  it('should be able to credit a bank account', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/10001555061257616/credit')
      .set('Authorization', `Bearer ${staffToken}`)
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
      .post('/api/v1/transactions/10001555061257616/credit')
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should let only a cashier credit a bank account', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/10001555061257616/credit')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not credit a dormant or draft bank account ', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/10001555061305898/credit')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        amount: 10000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not credit a bank account with no enough amount', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/20001555063343630/credit')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        amount: 40000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should give an error if the bank account is not found', (done) => {
    chai.request(server)
      .post('/api/v1/transactions/200015550633436/credit')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        amount: 40000,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

