import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';
import db from '../v2/db/dbconnection';

const expect = chai.expect;
let userToken;
chai.use(chaiHttp);


describe('User signup', () => {
  it('should let a user create a user account with valid credentials', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisarichard@banka.com',
        password: 'kalisa1!',
        confirmPassword: 'kalisa1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        userToken = res.body.data.token;
        done();
      });
  });
  it('should give access to create staff account to admin only  ', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signup')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        firstName: 'Richard',
        lastName: 'Kalisa',
        email: 'kalisa@banka.com',
        password: 'kalisa11',
        confirmPassword: 'kalisa11',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login user if the email is not registered', (done) => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'kay@banka.com',
        password: 'kalima1!',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should not login user with no password', (done) => {
    chai.request(server)
      .post('/api/v2/staff/auth/signin')
      .send({
        email: 'kabehotitia@banka.com',

      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
