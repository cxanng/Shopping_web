setLogInText();

const template = document.getElementById("product-template");
const container = document.getElementById("products-container");

const URL = `${getUrl()}/api/products`;

const renderProduct = products => {
  products.forEach(product => {
    const id = product._id;
    const newProduct = template.content.cloneNode(true);

    const itemRow = newProduct.querySelector("div");
    itemRow.setAttribute("id", `product-${id}`);

    const name = itemRow.querySelector("h3");
    name.setAttribute("id", `name-${id}`);
    name.innerText = product.name;

    const image = itemRow.querySelector(".product-image");
    image.setAttribute("id", `image-${id}`);
    image.setAttribute("src", product.image);

    const description = itemRow.querySelector(".product-description");
    description.setAttribute("id", `description-${id}`);
    description.innerText = product.description;

    const price = itemRow.querySelector(".product-price");
    price.setAttribute("id", `price-${id}`);
    price.innerText = product.price;

    const addToCart = itemRow.querySelector(".add-to-cart-button");
    addToCart.setAttribute("id", `add-to-cart-${id}`);
    addToCart.innerText = "Add to cart";
    addToCart.addEventListener("click", () => addProduct(product));

    const modifyItem = itemRow.querySelector(".modify-product-button");
    modifyItem.setAttribute("id", `modify-${id}`);
    modifyItem.addEventListener("click", () => modifyHandle(id));

    const deleteItem = itemRow.querySelector(".delete-product-button");
    deleteItem.setAttribute("id", `delete-${id}`);
    deleteItem.addEventListener("click", () => deleteHandle(id));

    container.appendChild(itemRow);
  });
};

const addProduct = ({ _id, name }) => {
  addProductToCart(_id);
  createNotification(`Added ${name} to cart!`, "notifications-container");
};

const productLoad = async () => {
  const products = await getJSON(URL);
  renderProduct(products);
  // TODO: handle message tell unsigned-in customers to sign in
};

const deleteHandle = async id => {
  const url = `api/products/${id}`;
  const response = await deleteResourse(url);
  if (response) {
    createNotification(
      `Deleted product ${response.name}`,
      "notifications-container",
      true
    );
    container
      .querySelectorAll(`#product-${id}`)
      .forEach(element => element.remove());
  }
};

const modifyHandle = async id => {
  const url = `api/products/${id}`;
  const productInfo = await getJSON(url);
  const formTemplate = document
    .getElementById("form-template")
    .content.cloneNode(true);
  const modifyContainer = document.getElementById("modify-product");

  const cloneDiv = formTemplate.querySelector("#edit-product-form");

  const heading = cloneDiv.querySelector("h2");
  heading.innerHTML = `Modify product ${productInfo.name}`;

  const productId = cloneDiv.querySelector("#id-input");
  productId.value = productInfo._id;

  const name = cloneDiv.querySelector("#name-input");
  name.value = productInfo.name;

  const description = cloneDiv.querySelector("#description-input");
  description.value = productInfo.description;

  const image = cloneDiv.querySelector("#image-input");
  image.value = productInfo.image;

  const price = cloneDiv.querySelector("#price-input");
  price.value = productInfo.price;

  modifyContainer.innerHTML = "";
  modifyContainer.appendChild(cloneDiv);

  document.getElementById("update-button").addEventListener("click", e => {
    e.preventDefault();
    if (!image.value.match(/^(http|https):\/\/\S+\.\w{2,}\/*\S*$/)) {
      createNotification(
        "Provide correct Url",
        "notifications-container",
        false
      );
    } else {
      const data = {
        ...productInfo,
        name: name.value,
        description: description.value,
        image: image.value,
        price: Number(price.value)
      };
      postOrPutJSON(url, "PUT", data).then(response => {
        if (response) {
          createNotification(
            `Updated product ${response.name}`,
            "notifications-container",
            true
          );
          document.getElementById(`name-${response._id}`).textContent =
            response.name;
          document.getElementById(`description-${response._id}`).textContent =
            response.description;
          document.getElementById(`price-${response._id}`).textContent =
            response.price;
          document
            .getElementById(`image-${response._id}`)
            .setAttribute("src", response.image);
        }
        removeElement("modify-product", "edit-product-form");
      });
    }
  });
};

document
  .getElementById("sort-by-name-button-increase")
  .addEventListener("click", () => {
    Array.from(container.querySelectorAll("div:nth-child(n+1)"))
      .sort((a, b) => {
        const text1 = a.querySelector(".product-name").innerText;
        const text2 = b.querySelector(".product-name").innerText;
        return text1.localeCompare(text2);
      })
      .forEach(tr => container.appendChild(tr));
  });

document
  .getElementById("sort-by-name-button-decrease")
  .addEventListener("click", () => {
    Array.from(container.querySelectorAll("div:nth-child(n+1)"))
      .sort((a, b) => {
        const text1 = a.querySelector(".product-name").innerText;
        const text2 = b.querySelector(".product-name").innerText;
        return text2.localeCompare(text1);
      })
      .forEach(tr => container.appendChild(tr));
  });

document
  .getElementById("sort-by-price-button-increase")
  .addEventListener("click", () => {
    Array.from(container.querySelectorAll("div:nth-child(n+1)"))
      .sort((a, b) => {
        const text1 = a.querySelector(".product-price").innerText;
        const text2 = b.querySelector(".product-price").innerText;
        return text1.localeCompare(text2, undefined, { numeric: true });
      })
      .forEach(tr => container.appendChild(tr));
  });

document
  .getElementById("sort-by-price-button-decrease")
  .addEventListener("click", () => {
    Array.from(container.querySelectorAll("div:nth-child(n+1)"))
      .sort((a, b) => {
        const text1 = a.querySelector(".product-price").innerText;
        const text2 = b.querySelector(".product-price").innerText;
        return text2.localeCompare(text1, undefined, { numeric: true });
      })
      .forEach(tr => container.appendChild(tr));
  });

productLoad();
