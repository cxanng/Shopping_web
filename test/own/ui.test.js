const puppeteer = require('puppeteer');
const http = require('http');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { handleRequest } = require('../../routes');
chai.use(chaiHttp);

const User = require('../../models/user');
const Product = require('../../models/product');

const shortWaitTime = 200;

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));

const adminUser = { ...users.find(u => u.role === 'admin') };

const rowSelector = '.item-row';

// Get products
const products = require('../../setup/products.json').map(product => ({ ...product }));

describe('User Inteface', () => {
  let productsPage;

  before(async () => {
    await Product.deleteMany({});
    await Product.create(products);
    allProducts = await Product.find({});

    server = http.createServer(handleRequest);
    server.listen(3000, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
    });
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });
    page = await browser.newPage();

    productsPage = `${baseUrl}/products.html`;
  });

  after(() => {
    server && server.close();
    browser && browser.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create(users);

    await page.authenticate({ username: adminUser.email, password: adminUser.password });
  });

  describe('UI: Sort products', () => {
    it('should sort products by name in increasing order', async () => {
      await page.goto(productsPage);
      await page.waitForTimeout(shortWaitTime);

      const selector = "#sort-by-name-button-increase";
      const sortByNameAsc = await page.$(selector);

      let errorMsg =
        `Authenticated as ${adminUser.email} and navigated to "/products.html" ` +
        `Tried to find sort button with selector "${selector}" ` +
        `but cannot found it`;

      expect(sortByNameAsc, errorMsg).not.to.be.null;

      await page.click(selector);
      await page.waitForTimeout(shortWaitTime);

      errorMsg = `Clicked sort by name, increasing, but the products are not in correct order`;

      const sortedProducts = products
        .sort(
          (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
        .map(p => p.name);
      const names = await page.$$(rowSelector);

      const sortedNames = [];

      for (const name of names) {
        const productName = await name.$(".product-name");
        const text = await productName.getProperty("innerText");
        sortedNames.push(await text.jsonValue());
      }

      expect(sortedNames).to.eql(sortedProducts);
    });

    it('should sort products by name in decreasing order', async () => {
      await page.goto(productsPage);
      await page.waitForTimeout(shortWaitTime);

      const selector = "#sort-by-name-button-decrease";
      const sortByNameAsc = await page.$(selector);

      let errorMsg =
        `Authenticated as ${adminUser.email} and navigated to "/products.html" ` +
        `Tried to find sort button with selector "${selector}" ` +
        `but cannot found it`;

      expect(sortByNameAsc, errorMsg).not.to.be.null;

      await page.click(selector);
      await page.waitForTimeout(shortWaitTime);

      errorMsg = `Clicked sort by name, increasing, but the products are not in correct order`;

      const sortedProducts = products
        .sort(
          (a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase())
        )
        .map(p => p.name);
      const names = await page.$$(rowSelector);

      const sortedNames = [];

      for (const name of names) {
        const productName = await name.$(".product-name");
        const text = await productName.getProperty("innerText");
        sortedNames.push(await text.jsonValue());
      }

      expect(sortedNames).to.eql(sortedProducts);
    });

    it('should sort products by price in increasing order', async () => {
      await page.goto(productsPage);
      await page.waitForTimeout(shortWaitTime);

      const selector = "#sort-by-price-button-increase";
      const sortByNameAsc = await page.$(selector);

      let errorMsg =
        `Authenticated as ${adminUser.email} and navigated to "/products.html" ` +
        `Tried to find sort button with selector "${selector}" ` +
        `but cannot found it`;

      expect(sortByNameAsc, errorMsg).not.to.be.null;

      await page.click(selector);
      await page.waitForTimeout(shortWaitTime);

      errorMsg = `Clicked sort by price, increasing, but the products are not in correct order`;

      const sortedProducts = products
        .sort(
          (a, b) => a.price - b.price
        )
        .map(p => p.price);
      const names = await page.$$(rowSelector);

      const sortedPrices = [];

      for (const name of names) {
        const productPrice = await name.$(".product-price");
        const text = await productPrice.getProperty("innerText");
        sortedPrices.push(Number(await text.jsonValue()));
      }

      expect(sortedPrices).to.eql(sortedProducts);
    });

    it('should sort products by price in increasing order', async () => {
      await page.goto(productsPage);
      await page.waitForTimeout(shortWaitTime);

      const selector = "#sort-by-price-button-decrease";
      const sortByNameAsc = await page.$(selector);

      let errorMsg =
        `Authenticated as ${adminUser.email} and navigated to "/products.html" ` +
        `Tried to find sort button with selector "${selector}" ` +
        `but cannot found it`;

      expect(sortByNameAsc, errorMsg).not.to.be.null;

      await page.click(selector);
      await page.waitForTimeout(shortWaitTime);

      errorMsg = `Clicked sort by price, decreasing, but the products are not in correct order`;

      const sortedProducts = products
        .sort(
          (a, b) => b.price - a.price
        )
        .map(p => p.price);
      const names = await page.$$(rowSelector);

      const sortedPrices = [];

      for (const name of names) {
        const productPrice = await name.$(".product-price");
        const text = await productPrice.getProperty("innerText");
        sortedPrices.push(Number(await text.jsonValue()));
      }

      expect(sortedPrices).to.eql(sortedProducts);
    });
  });
});
