const products = require("../products.json").map(product => ({ ...product }));

const getAllProducts = () => products.map(product => ({ ...product }));

module.exports = {
    getAllProducts
};