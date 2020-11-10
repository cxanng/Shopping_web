const template = document.getElementById("product-template");
const container = document.getElementById("products-container");

const URL = "http://localhost:3000/api/products";

const renderProduct = products => {
    products.forEach(product => {
        const id = product._id;
        const newProduct = template.content.cloneNode(true);

        const itemRow = newProduct.querySelector("div");
        itemRow.setAttribute("id", `product-${id}`);

        const name = itemRow.querySelector("h3");
        name.setAttribute("id", `name-${id}`);
        name.innerText = product.name;

        const description = itemRow.querySelector(".product-description");
        description.setAttribute("id", `description-${id}`);
        description.innerText = product.description;

        const price = itemRow.querySelector(".product-price");
        price.setAttribute("id", `price-${id}`);
        price.innerText = product.price;

        const addToCart = itemRow.querySelector("button");
        addToCart.setAttribute("id", `add-to-cart-${id}`);
        addToCart.innerText = "Add to cart";
        addToCart.setAttribute("onclick", `addProduct(${id}, ${name})`);

        container.appendChild(itemRow);
    });
}

const addProduct = (id, name) => {
    addProductToCart(id);
    createNotification(`Added ${name} to cart!`, "notifications-container");
}

const products = await getJSON(URL);
renderProduct(products);