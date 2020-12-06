const chai = require('chai');
const { get } = require('mongoose');
const expect = chai.expect;
const { createRequest } = require('node-mocks-http');
const { getCurrentUser, verifyLoginUser } = require('../../auth/auth');

const User = require('../../models/user');

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

const getToken = credential => credential ? `Bearer ${credential.token}` : null;

const getRequest = headers => createRequest({ headers });

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };


describe('Auth', () => {
  let admin;
  let adminCredentials;
  let nonExistCredential;
  let incorrectCredential;
  
  // get headers for tests
  const getHeaders = async () => {
    const token = getToken(adminCredentials);
    return {
      authorization: token
    };
  };

  before(async () => {
    await User.deleteMany({});
    await User.create(users);
    admin = await User.findOne({ email: adminUser.email }).exec();
    adminCredentials = await verifyLoginUser(adminUser);
    nonExistCredential = await verifyLoginUser({ email: adminUser.password, password: adminUser.password });
    incorrectCredential = await verifyLoginUser({ email: adminUser.email, password: adminUser.email });
  });

  describe('getCurrentUser()', () => {
    it('should return null when "Authorization" header is missing', async () => {
      const headers = await getHeaders();
      delete headers.authorization;
      const user = await getCurrentUser(getRequest(headers));
      expect(user).to.be.null;
    });

    it('should return null when "Authorization" header is empty', async () => {
      const headers = await getHeaders();
      headers.authorization = '';
      const user = await getCurrentUser(getRequest(headers));
      expect(user).to.be.null;
    });

    it('should return null when "Authorization" type is not "Bearer"', async () => {
      const headers = await getHeaders();
      headers.authorization = headers.authorization.replace('Bearer', 'Basic');
      const user = await getCurrentUser(getRequest(headers));
      expect(user).to.be.null;
    });

    it('should return null when user does not exist', async () => {
      const headers = await getHeaders();
      headers.authorization = `${getToken(nonExistCredential)}`;
      const user = await getCurrentUser(getRequest(headers));
      expect(user).to.be.null;
    });

    it('should return null when password is incorrect', async () => {
      const headers = getHeaders();
      headers.authorization = `${getToken(incorrectCredential)}`;
      const user = await getCurrentUser(getRequest(headers));
      expect(user).to.be.null;
    });

    it('should return user object when credentials are correct', async () => {
      const headers = await getHeaders();
      const user = await getCurrentUser(getRequest(headers));
      expect(user).to.be.an('object');
      expect(user.id).to.equal(admin.id);
      expect(user.name).to.equal(admin.name);
      expect(user.email).to.equal(admin.email);
      expect(user.role).to.equal(admin.role);
      expect(user.password).to.equal(admin.password);
    });
  });
});
