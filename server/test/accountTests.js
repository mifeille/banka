import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let expect = chai.expect;
chai.use(chaiHttp);

describe('User create account', () => {
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
})