const chai = require('chai');
const expect = chai.expect;

const Product = require('../../models/product');

const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };

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
      const data = getTestData();
      delete data.name;
      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist;
  });

  it('must not "name" to be longer than 50 letters', () => {
    const data = getTestData();
    data.name = generateRandomString(51);
    const product = new Product(data);
    const error = product.validateSync();
    expect(error).to.exist;
  });

  it('must not allow empty name', () => {
    const data = getTestData();
    data.name = '';
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

  it('"price" must be a number', () => {
    const data = getTestData();
    data.price = generateRandomString();
    const product = new Product(data);
    const error = product.validateSync();
    expect(error).to.exist;
  });

  it('must not allow "price" to be 0', () => {
      const data = getTestData();
      data.price = 0;
      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist; 
  });

  it('must not allow "price" to less than 0', () => {
    const data = getTestData();
    data.price = -2.0;
    const product = new Product(data);
    const error = product.validateSync();
    expect(error).to.exist; 
  });

  it('"image" url must be valid', () => {
    const data = getTestData();
    data.image = generateRandomString();
    const product = new Product(data);
    const error = product.validateSync();
    expect(error).to.exist;
  });
  it('must allow valid "image" url', () => {
    const data = getTestData();
    data.image = "https://www.google.com/imgres?imgurl=https%3A%2F%2Fp.bigstockphoto.com%2FGeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg&imgrefurl=https%3A%2F%2Fwww.bigstockphoto.com%2F&tbnid=I0zAF9TavGWK5M&vet=12ahUKEwihhpGD5LrtAhVUgosKHe4HBWAQMygCegUIARCpAQ..i&docid=y3nWK2hdEell5M&w=1028&h=432&q=image&ved=2ahUKEwihhpGD5LrtAhVUgosKHe4HBWAQMygCegUIARCpAQ";
    const product = new Product(data);
    const error = product.validateSync();
    expect(error).to.be.undefined;
  });

});
});
