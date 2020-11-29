const template = document.getElementById('cart-item-template');
const container = document.getElementById('cart-container');

const URL = "http://localhost:3000/api/products";

const getAllProductsFromCart = async () => {
  const products = await getJSON(URL);
  return Object.keys(sessionStorage).map(key => ({
    item: products.find(element => element._id === key),
    count: parseInt(sessionStorage.getItem(key))
  }));
};

const renderCart = async () => {
  const products = await getAllProductsFromCart();
  products.forEach(product => {
    const id = product.item._id;
    const newProduct = template.content.cloneNode(true);

    const itemRow = newProduct.querySelector(".item-row");
    itemRow.setAttribute("id", `product-${id}`);

    const name = itemRow.querySelector("h3");
    name.setAttribute("id", `name-${id}`);
    name.innerText = product.item.name;

    const price = itemRow.querySelector(".product-price");
    price.setAttribute("id", `price-${id}`);
    price.innerText = product.item.price;

    const amount = itemRow.querySelector(".product-amount");
    amount.setAttribute("id", `amount-${id}`);
    amount.innerText = `${product.count}x`;

    const plusButton = itemRow.querySelectorAll(".cart-minus-plus-button")[0];
    plusButton.setAttribute("id", `plus-${id}`);
    plusButton.addEventListener("click", () => addProduct(id)); 

    const minusButton = itemRow.querySelectorAll(".cart-minus-plus-button")[1];
    minusButton.setAttribute("id", `minus-${id}`);
    minusButton.addEventListener("click", () => decreaseProduct(id));

    container.appendChild(itemRow);
  })
}

const addProduct = (id) => {
  const newAmount = addProductToCart(id);
  const amount = document.getElementById(`amount-${id}`);
  amount.innerText = `${newAmount}x`;
}

const decreaseProduct = (id) => {
  const newAmount = decreaseProductCount(id);
  if (!newAmount) {
    removeElement("cart-container", `product-${id}`);
  } else {
    const amount = document.getElementById(`amount-${id}`);
    amount.innerText = `${newAmount}x`;
  }
}

const placeNewOrder = async () => {
  const items = Object.keys(sessionStorage);
  const allProducts = await getJSON("/api/products");
  const orderedItems = items.map(id => new { 
    product: allProducts.find(x => x.id === id),
    quantity: parseInt(sessionStorage.getItem(id))
  });
  if (orderedItems.length !== 0) {
    const order = { items: orderedItems }
    postOrPutJSON("/api/orders", "POST", order);
  }
}

document.getElementById("place-order-button").addEventListener(
  "click",
  async (e) => {
    e.preventDefault();
    placeNewOrder()
    clearCart();
    document.getElementById("cart-container").innerHTML = "";
    createNotification("Order placed", "notifications-container", true);

  }  
);

renderCart();