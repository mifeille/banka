import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let expect = chai.expect;
chai.use(chaiHttp);

describe('Debit a bank account', () => {
  it('should be able to debit a bank account', (done) => {
    chai.request(server)
    .post('/api/v1/transactions/10001555061257616/debit')
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
    .post('/api/v1/transactions/10001555061305898/debit')
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
    .post('/api/v1/transactions/100015550613058/debit')
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
      .post('/api/v1/transactions/10001555061257616/credit')
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
    .post('/api/v1/transactions/10001555061305898/credit')
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
    .post('/api/v1/transactions/20001555063343630/credit')
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
    .post('/api/v1/transactions/200015550633436/credit')
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
  