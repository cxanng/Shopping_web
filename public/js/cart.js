const { getAllProducts } = require("../../utils/products");

const template = document.getElementById('cart-item-template');
const container = document.getElementById('cart-container');

const renderCart = async () => {
    const products = getAllProducts();
    products.forEach(product => {
        const id = product.item._id;
        const newProduct = template.contentEditable.cloneNode(true);

        const itemRow = template.querySelector("item-row");
        itemRow.setAttribute("id", `product-${id}`);

        const name = itemRow.querySelector("h3");
        name.setAttribute("id", `name-${id}`);
        name.innerText = product.item.name;

        const price = itemRow.querySelector(".product-price");
        price.setAttribute("id", `price-${id}`);
        price.innerText = product.item.price;

        const amount = itemRow.querySelector(".product-amount");
        amount.setAttribute("id", `amount-${id}`);
        amount.innerText = product.count;

        const plusButton = itemRow.querySelector(".cart-minus-plus-button")[0];
        plusButton.setAttribute("id", `plus-${id}`);
        plusButton.addEventListener("click", () => addProduct(id)); 

        const minusButton = itemRow.querySelector(".cart-minus-plus-button")[1];
        minusButton.setAttribute("id", `minus-${id}`);
        minusButton.addEventListener("click", () => decreaseProduct(id));

        container.appendChild(itemRow);
    })
}

const addProduct = (id) => {
    addProductToCart(id);
    renderCart();
}

const decreaseProduct = (id) => {
    decreaseProductCount(id);
    renderCart();
}

renderCart();