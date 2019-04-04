import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let expect = chai.expect;
chai.use(chaiHttp);

describe('Debit a bank account', () => {
  it('should be able to debit a bank account', (done) => {
    chai.request(server)
    .post('/api/v1/transactions/1/debit')
    .send({
        amount : 45000
    })
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should not debit a draft or dormant account', (done) => {
    chai.request(server)
    .post('/api/v1/transactions/2/debit')
    .send({
        amount : 45000
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an error when the bank account is not found', (done) => {
    chai.request(server)
    .post('/api/v1/transactions/8/debit')
    .send({
        amount : 45000
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
      .post('/api/v1/transactions/1/credit')
      .send({
          amount : 10000
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not credit a dormant or draft bank account ', (done) => {
    chai.request(server)
    .post('/api/v1/transactions/2/credit')
    .send({
        amount : 10000
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

  it('should not credit a bank account with no enough amount', (done) => {
    chai.request(server)
    .post('/api/v1/transactions/4/credit')
    .send({
        amount : 40000
    })
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      done();
    });
});

it('should give an error if the bank account is not found', (done) => {
    chai.request(server)
    .post('/api/v1/transactions/8/credit')
    .send({
        amount : 40000
    })
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.an('object');
      done();
    });
});
})
  