const orderTemplate = document.getElementById("order-template");
const itemTemplate = document.getElementById("order-item-template");
const container = document.getElementById("orders-container");

const URL = "http://localhost:3000/api/orders";

const renderOrder = orders => {
    orders.forEach(order => {
        const orderId = order._id;
        const orderNode = orderTemplate.content.cloneNode(true);

        const orderRow = orderNode.querySelector("div");
        orderRow.setAttribute("id", `order-${orderId}`);

        order.items.forEach(orderedItem => {
            const productId = orderedItem._id;
            const itemNode = itemTemplate.content.cloneNode(true);

            const itemRow = itemNode.querySelector("div");
            itemRow.setAttribute("id", `product-${productId}`);

            const name = itemRow.querySelector(".product-name");
            name.setAttribute("id", `name-${productId}`);
            name.innerText = orderedItem.product.name;

            const description = itemRow.querySelector(".product-description");
            description.setAttribute("id", `description-${productId}`);
            description.innerText = orderedItem.product.description;

            const price = itemRow.querySelector(".product-price");
            price.setAttribute("id", `price-${productId}`);
            price.innerText = orderedItem.product.price;

            const amount = itemRow.querySelector(".product-amount");
            amount.setAttribute("id", `amount-${productId}`)
            amount.innerText = orderedItem.quantity;

            orderRow.appendChild(itemRow);
        });
        container.appendChild(orderRow);
    });
}

const orderLoad = async () => {
    const orders = await getJSON(URL);
    renderOrder(orders);
}
orderLoad();