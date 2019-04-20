import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';
import db from '../v2/db/dbconnection'

let userToken,adminToken,staffToken,accountnumb;

let expect = chai.expect;
chai.use(chaiHttp);

describe('Bank account creation', () => {

  before((done) => {
        chai.request(server)
        .post('/api/v2/auth/signin')
        .send({
            email: "kayirangwamelissa@banka.com",
            password : "kayirangwa1!"
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            userToken = res.body.data.token;
            done();
        });
    });
    
    after((done) =>{
        db.query(`DELETE FROM accounts WHERE accountnumber='${accountnumb}'`);
        done();
    });
    
    it('should be able to create a bank account', (done) => {   
        chai.request(server)
        .post('/api/v2/accounts')
        .set("Authorization", `Bearer ${userToken}`)
        .send({
            type: "savings"
        })
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            accountnumb = res.body.data.accountnumber;
            done();
        });
    });
    
    it('should give an error if the token is not provided', (done) => {   
        chai.request(server)
        .post('/api/v2/accounts')
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
        .post('/api/v2/accounts')
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

});

