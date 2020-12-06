const chai = require('chai');
const { createRequest } = require('node-mocks-http');
const { verifyLoginUser } = require('../../auth/auth');
const { acceptsJson, getCredentials, isJson } = require('../../utils/requestUtils');
const User = require('../../models/user');
const expect = chai.expect;

// helper function for authorization headers
const getToken = credential => credential ? `Bearer ${credential.token}` : null;

const getRequest = headers => createRequest({ headers });

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };

describe('Request Utils', () => {
  let adminCredentials;

  // get headers for tests
  const getHeaders = async () => {
    return {
      authorization: getToken(adminCredentials),
      accept:
        'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'content-type': 'application/json'
    };
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create(users);
    adminCredentials = await verifyLoginUser(adminUser);
  });

  describe('acceptsJson()', () => {
    it('should return false when "Accept" header is missing', async () => {
      const headers = await getHeaders();
      delete headers.accept;
      expect(acceptsJson(getRequest(headers))).to.be.false;
    });

    it('should return false when "Accept" header does not include "application/json" or "*/*"', async () => {
      const headers = await getHeaders();
      headers.accept = headers.accept
        .split(',')
        .filter(header => !header.includes('application/json') && !header.includes('*/*'))
        .join(',');

      expect(acceptsJson(getRequest(headers))).to.be.false;
    });

    it('should return true when "Accept" header includes "application/json"', async () => {
      const headers = await getHeaders();
      headers.accept = headers.accept
        .split(',')
        .filter(header => !header.includes('*/*'))
        .join(',');

      expect(acceptsJson(getRequest(headers))).to.be.true;
    });

    it('should return true when "Accept" header includes "*/*"', async () => {
      const headers = await getHeaders();
      headers.accept = headers.accept
        .split(',')
        .filter(header => !header.includes('application/json'))
        .join(',');

      expect(acceptsJson(getRequest(headers))).to.be.true;
    });
  });

  describe('getCredentials()', () => {
    it('should return null when "Authorization" header is missing', async () => {
      const headers = await getHeaders();
      delete headers.authorization;
      expect(getCredentials(getRequest(headers))).to.be.null;
    });

    it('should return null when "Authorization" header is empty', async () => {
      const headers = await getHeaders();
      headers.authorization = '';
      expect(getCredentials(getRequest(headers))).to.be.null;
    });

    it('should return null when "Authorization" type is not "Bearer"', async () => {
      const headers = await getHeaders();
      headers.authorization = headers.authorization.replace('Bearer', 'Basic');
      expect(getCredentials(getRequest(headers))).to.be.null;
    });

    it('should return Array when "Authorization" type is "Bearer"', async () => {
      const headers = await getHeaders();
      expect(getCredentials(getRequest(headers))).to.be.an('string');
    });

    it('should return parsed credentials in an Array when "Authorization" header is correct', async () => {
      const headers = await getHeaders();
      const credentials = getCredentials(getRequest(headers));
      expect(credentials).to.be.an('string');
      expect(credentials).to.equal(adminCredentials.token);
    });
  });

  describe('isJson()', () => {
    it('should return false when "Content-Type" header is missing', async () => {
      const headers = await getHeaders();
      delete headers['content-type'];
      expect(isJson(getRequest(headers))).to.be.false;
    });

    it('should return false when "Content-Type" header is empty', async () => {
      const headers = await getHeaders();
      headers['content-type'] = '';
      expect(isJson(getRequest(headers))).to.be.false;
    });

    it('should return false when "Content-Type" is not "application/json', async () => {
      const headers = await getHeaders();
      headers['content-type'] = 'application/x-www-form-urlencoded';
      expect(isJson(getRequest(headers))).to.be.false;
    });

    it('should return true when "Content-Type" is "application/json', async () => {
      const headers = await getHeaders();
      expect(isJson(getRequest(headers))).to.be.true;
    });
  });
});
