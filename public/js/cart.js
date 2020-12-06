const orderTemplate = document.getElementById("order-template");
const itemTemplate = document.getElementById("order-item-template");
const container = document.getElementById("orders-container");

const URL = `${getUrl()}/api/orders`;

const renderOrder = orders => {
  orders.forEach(order => {
    const orderId = order._id;
    const orderNode = orderTemplate.content.cloneNode(true);

    const orderRow = orderNode.querySelector("div");
    orderRow.setAttribute("id", `order-${orderId}`);
    let total = 0.0;
    order.items.forEach(orderedItem => {
      const productId = orderedItem._id;
      const itemNode = itemTemplate.content.cloneNode(true);

      const itemRow = itemNode.querySelector("div");
      itemRow.setAttribute("id", `product-${productId}`);

      const name = itemRow.querySelector(".product-name");
      name.setAttribute("id", `name-${productId}`);
      name.innerText = `Name: ${orderedItem.product.name}`;

      const description = itemRow.querySelector(".product-description");
      description.setAttribute("id", `description-${productId}`);
      description.innerText = `Description: ${orderedItem.product.description}`;

      const price = itemRow.querySelector(".product-price");
      price.setAttribute("id", `price-${productId}`);
      price.innerText = `Price: ${orderedItem.product.price}`;

      const amount = itemRow.querySelector(".product-amount");
      amount.setAttribute("id", `amount-${productId}`);
      amount.innerText = `Quantity: ${orderedItem.quantity}`;

      total =
        total +
        Number(orderedItem.product.price) * Number(orderedItem.quantity);

      orderRow.appendChild(itemRow);
    });
    orderNode.querySelector(
      ".total-price"
    ).innerText = `Total price for order: ${total}`;
    console.log(total);
    container.appendChild(orderNode);
  });
};

const orderLoad = async () => {
  const orders = await getJSON(URL);
  renderOrder(orders);
};
orderLoad();
