import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../server';

let userToken,adminToken,staffToken;

let expect = chai.expect;
chai.use(chaiHttp);

describe('Users', () => {
  it('should be able to fetch all users', (done) => {
    chai.request(server)
    .get('/api/v1/users')
    .send()
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      done();
    });
});
})

describe('Staff login', () => {
  it('should login a staff without the correct credentials', (done) => {
    chai.request(server)
    .post('/api/v1/staff/signin')
    .send(
      {
        email: "kabeho@banka.com",
        password : "kabeho1!"
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not log in a staff with an integer email ', (done) => {
      chai.request(server)
      .post('/api/v1/staff/signin')
      .send({
        email: 1,
        password : "kabeho1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not login a staff without email address', (done) => {
      chai.request(server)
      .post('/api/v1/staff/signin')
      .send({
        email: "",
        password : "kalima1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });

    it('should not login a staff with an incorrect email address', (done) => {
      chai.request(server)
      .post('/api/v1/staff/signin')
      .send({
        email: "kabeho.com",
        password : "kabeho1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not login a staff with an incorrect email or password', (done) => {
      chai.request(server)
      .post('/api/v1/staff/signin')
      .send({ 
        email: "kabeho@banka.com",
        password : "kabeh1"})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    
    it('should not login a staff if the email is not registered', (done) => {
      chai.request(server)
      .post('/api/v1/staff/signin')
      .send({ 
        email: "kalim@banka.com",
        password : "kalima1!"
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        done();
      });
    });

    it('should not login a staff with no password', (done) => {
      chai.request(server)
      .post('/api/v1/staff/signin')
      .send({ 
        email: "kabeho@banka.com",
        password : ""
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
    });
    });

    describe('Staff signup', () => {

        before((done) => {
            chai.request(server)
            .post('/api/v1/staff/signin')
            .send({
              email: "kabeho@banka.com",
              password: "kabeho1!"
            })
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              adminToken = res.body.data.token;
              done();
            });
          })
    
          it('should be able to create a staff account', (done) => {
            chai.request(server)
            .post('/api/v1/staff/signup')
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                firstName: "Nadia",
                lastName : "Condo",
                email: "condo@banka.com",
                password: "condonadia1!",
                confirmPassword: "condonadia1!",
                isAdmin: "No"
            })
            .end((err, res) => {
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('object');
              staffToken = res.body.data.token;
              done();
            });
        });

        it('should refuse access if the token is not provided', (done) => {
            chai.request(server)
            .post('/api/v1/staff/signup')
            .send({
              firstName: "Nadia",
              lastName : "Condo",
              email: "condo@banka.com",
              password: "condonadia1!",
              confirmPassword: "condonadia1!",
              isAdmin: "No"
            })
            .end((err, res) => {
              expect(res).to.have.status(403);
              expect(res.body).to.be.an('object');
              done();
            });
        });

        it('should not register a staff with an empty email field', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstName: "Nadia",
            lastName : "Condo",
            email: "",
            password: "condonadia1!",
            confirmPassword: "condonadia1!",
            isAdmin: "No"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
      });
      
        it('should not register a staff with an integer email ', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstName: "Richard",
            lastName : "Kalisa",
            email: 2,
            password: "kalisa1!",
            confirmPassword: "kalisa1!"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
      });
      
      it('should not register a new staff with an already existing email', (done) => {
        chai.request(server)
        .post('/api/v1/staff/signup')
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            firstName: "Nadia",
            lastName : "Condo",
            email: "condo@banka.com",
            password: "condonadia1!",
            confirmPassword: "condonadia1!",
            isAdmin: "No"
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          done();
        });
      });
              
      it('should not register a staff with a wrong email format', (done) => {
        chai.request(server)
        .post('/api/v1/staff/signup')
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          firstName: "Richard",
          lastName : "Kalisa",
          email: "kalisabanka.com",
          password: "kalisa1!",
          confirmPassword: "kalisa1!"
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          done();
        });
      });
      
      it('should not register staff with an empty First Name field ', (done) => {
        chai.request(server)
        .post('/api/v1/auth/signup')
        .set("Authorization", `Bearer ${adminToken}`)
        .send(
          {
            firstName: "",
            lastName : "Kalisa",
            email: "kalisa@banka.com",
            password: "kalisa1!",
            confirmPassword: "kalisa1!"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
        });
      
        it('should not register a staff with an integer as First Name ', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send(
            {
              firstName: 1,
              lastName : "Kalisa",
              email: "kalisa@banka.com",
              password: "kalisa1!",
              confirmPassword: "kalisa1!"
            })
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              done();
            });
          });
      
          it('should accept only letters in the first name   ', (done) => {
            chai.request(server)
            .post('/api/v1/staff/signup')
            .set("Authorization", `Bearer ${adminToken}`)
            .send(
              {
                firstName: "Patri1",
                lastName : "Kalisa",
                email: "kalisa@banka.com",
                password: "kalisa1!",
                confirmPassword: "kalisa1!"
              })
              .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
              });
            });
        
        it('should not register a staff with an empty Last Name field ', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstName: "Richard",
            lastName : "",
            email: "kalisa@banka.com",
            password: "kalisa1!",
            confirmPassword: "kalisa1!"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
        });
      
        it('should not register staff with an integer as Last Name ', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send(
            {
              firstName: "Patrick",
              lastName : 1,
              email: "kalisa@banka.com",
              password: "kalisa1!",
              confirmPassword: "kalisa1!"
            })
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              done();
            });
          });
      
          it('should accept only letters in the last name ', (done) => {
            chai.request(server)
            .post('/api/v1/staff/signup')
            .set("Authorization", `Bearer ${adminToken}`)
            .send(
              {
                firstName: "Patrick",
                lastName : "Kalis1",
                email: "kalisa@banka.com",
                password: "kalisa1!",
                confirmPassword: "kalisa1!"
              })
              .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                done();
              });
            });
        
      
        it('should not register a staff without password', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send( 
            {
              firstName: "Richard",
              lastName : "Kalisa",
              email: "kalisa@banka.com",
              password: "",
              confirmPassword: "kalisa1!"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
            });
        });
      
        it('should not allow white spaces in the password', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send( 
            {
              firstName: "Richard",
              lastName : "Kalisa",
              email: "kalisa@banka.com",
              password: "kalisa 1!",
              confirmPassword: "kalisa1!"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
            });
        });
        
        it('should register a password that has at least 6 characters ', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstName: "Richard",
            lastName : "Kalisa",
            email: "kalisa@banka.com",
            password: "sa1!",
            confirmPassword: "sa1!"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
        });
        
        it('should give an error when password and confirm password do not match  ', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstName: "Richard",
            lastName : "Kalisa",
            email: "kalisa@banka.com",
            password: "kalisa1",
            confirmPassword: "kalisa1!"
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
        });
      
        it('should not register a staff without confirming his password  ', (done) => {
          chai.request(server)
          .post('/api/v1/staff/signup')
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstName: "Richard",
            lastName : "Kalisa",
            email: "kalisa@banka.com",
            password: "kalisa11",
            confirmPassword: ""
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            done();
          });
        });
     });
      
        