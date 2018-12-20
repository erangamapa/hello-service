const request = require('supertest');
const httpMocks = require('node-mocks-http');
const proxyquire = require('proxyquire-2');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Should be able to get hello response depending on the auth', function() {
  it('Should return 403 when trying to get hello with invalid token', function (done) {
    //mock middleware in server
    app = proxyquire('../server', {
      './middleware': {
        checkToken: (req, res, next) => {
          //send fail as token is invalid
          return res.status(403).json({
            success: false,
            message: 'Token is not valid'
          });
        }
      }
    });
    request(app)
      .get('/hello')
      .set('Authorization', 'Bearer invalid')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(403);
        expect(res.body).to.have.property('message');
        expect(res.body.success).to.equal(false);
        done(err);
      });
  });
  it('Should return 200 with greeting when trying to get hello with valid token', function (done) {
    //mock middleware in server
    app = proxyquire('../server', {
      './middleware': {
        checkToken: (req, res, next) => {
          //attach decoded payload and pass the control
          req.decoded = {username: 'Testname'};
          next();
        }
      }
    });
    request(app)
      .get('/hello')
      .set('Authorization', 'Bearer validtoken')
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Hello Testname');
        expect(res.body.success).to.equal(true);
        done(err);
      });
  });
});

describe('Middleware should handle authenticaton by valiting token', function() {
  it('Should return 403 in request when token do not exist', function (done) {
    //mock dependencies in middleware
    middleware = proxyquire('../middleware', {
      jsonwebtoken: {
        verify: (token, secret, cb) => {
          //return invalid error
          cb({message: 'invalid token'}, null);
        }
      }
    });
    let next = sinon.spy();
    let req  = httpMocks.createRequest({
        method: 'GET',
        url: '/hello'
    });
    let res  = httpMocks.createResponse({});
    middleware.checkToken(req, res ,next);
    expect(res.statusCode).to.equal(403);
    done();
  });
  it('Should return 403 in request when token is invalid', function (done) {
    //mock dependencies in middleware
    middleware = proxyquire('../middleware', {
      jsonwebtoken: {
        verify: (token, secret, cb) => {
          //return invalid error
          cb({message: 'invalid token'}, null);
        }
      }
    });
    let next = sinon.spy();
    let req  = httpMocks.createRequest({
        method: 'GET',
        url: '/hello',
        headers: {
          authorization: 'Bearer validtoken'
        }
    });
    let res  = httpMocks.createResponse({});
    middleware.checkToken(req, res ,next);
    expect(res.statusCode).to.equal(403);
    done();
  });
  it('Should return 500 in response if any error occours from the code', function (done) {
    //mock dependencies in middleware
    middleware = proxyquire('../middleware', {
      jsonwebtoken: {
        verify: (token, secret, cb) => {
          //throw error
          throw new Error('Error occoured when verifying token');
        }
      }
    });
    let next = sinon.spy();
    let req  = httpMocks.createRequest({
        method: 'GET',
        url: '/hello',
        headers: {
          authorization: 'Bearer validtoken'
        }
    });
    let res  = httpMocks.createResponse({});
    middleware.checkToken(req, res ,next);
    expect(res.statusCode).to.equal(500);
    done();
  });
  it('Should allow the request to next stage', function (done) {
    //mock dependencies in middleware
    middleware = proxyquire('../middleware', {
      jsonwebtoken: {
        verify: (token, secret, cb) => {
          //return decoded payload
          cb(null, {username: 'Testname'});
        }
      }
    });
    let next = sinon.spy();
    let req  = httpMocks.createRequest({
        method: 'GET',
        url: '/hello',
        headers: {
          authorization: 'Bearer validtoken'
        }
    });
    let res  = httpMocks.createResponse({});
    middleware.checkToken(req, res ,next);
    expect(next.calledOnce).to.equal(true);
    done();
  });
});