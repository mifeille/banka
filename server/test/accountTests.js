import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let expect = chai.expect;
chai.use(chaiHttp);

describe('Bank account', () => {
  it('should be able to create a bank account', (done) => {
    chai.request(server)
    .post('/api/v1/accounts')
    .send({
        firstName: "Patrick",
        lastName : "Kalima",
        email: "kalima@banka.com",
        type: "savings"
    })
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should not create a bank account when the account type is empty', (done) => {
    chai.request(server)
    .post('/api/v1/accounts')
    .send({
        firstName: "Patrick",
        lastName : "Kalima",
        email: "kalima@banka.com",
        type: ""
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should not create a bank account if the user email doe not exist', (done) => {
    chai.request(server)
    .post('/api/v1/accounts')
    .send({
        firstName: "Patrick",
        lastName : "Kalima",
        email: "kali@banka.com",
        type: "savings"
    })
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should let a staff/admin be able to activate or deactivate a bank account', (done) => {
    chai.request(server)
    .patch('/api/v1/account/3')
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an error if the bank account to update is not found', (done) => {
    chai.request(server)
    .patch('/api/v1/account/7')
    .send({
        status: "active"
    })
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      done();
    });
});
})