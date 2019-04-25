import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';


let userToken; let accountnumb; let adminToken; let
  cashierToken; let account2;

const expect = chai.expect;
chai.use(chaiHttp);

describe('Bank account creation', () => {
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

})