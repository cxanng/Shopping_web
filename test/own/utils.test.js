// describe("Sort functionalities", () => {
//   it("Should sort by name correspondingly", () => {
//     throw "Not implemented";
//   });

//   it("Should sort by price accordingly", () => {
//     throw "Not implemented";
//   });
// });

const chai = require('chai');
const expect = chai.expect;

const Product = require('../../models/product');
const User = require('../../models/user');

const { createResponse } = require('node-mocks-http');
const {
  registerProduct,
  deleteProduct,
  updateProduct
} = require('../../controllers/products');

const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };
// Get products
const products = require('../../setup/products.json').map(product => ({ ...product }));
// Set variables
const productsUrl = '/api/products';
const contentType = 'application/json';

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);
const invalidCredentials = encodeCredentials(adminUser.email, customerUser.password);

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random().toString(36).substr(2, 9).trim();
  } while (str.length < len);

  return str.substr(0, len);
};

// get randomized test data
const getTestData = () => {
  return {
    name: generateRandomString(),
    description: generateRandomString(20),
    price: 3.0,
  };
};

describe('Product Model', () => {
describe('Schema validation', () => {
  it('must require "name"', () => {
      // 10.3
      // expect(() => {}).to.throw(); 
      // 10.5
      const data = getTestData();
      delete data.name;
      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist;
  });

  it('must not allow "name" to have only spaces', () => {
      const data = getTestData();
      data.name = '     ';
      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist;
  });

  it('must require "price"', () => {
      const data = getTestData();
      delete data.price;
      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist;
  });

  it('must not allow "price" to be 0 or less', () => {
      const data = getTestData();
      data.price = -2.0;
      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist; 
  });
});
});
