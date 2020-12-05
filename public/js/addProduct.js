document.getElementById("btnAddProduct").addEventListener("click", e => {
  e.preventDefault();
  const form = document.getElementById("add-product-form");
  const name = form.querySelector("#name").value;
  const description = form.querySelector("#description").value;
  const price = form.querySelector("#price").value;
  const image = form.querySelector("#image").value;

  if (!image.match(/^(http|https):\/\/\S+\.\w{2,}\/*\S*$/)) {
    createNotification("Provide correct Url", "notifications-container", false);
  } else {
    form.reset();
    createNotification(
      `Product ${name} added`,
      "notifications-container",
      true
    );
    const data = {
      name: name,
      description: description,
      price: Number(price),
      image: image
    };
    postOrPutJSON(`${getUrl()}/api/products`, "POST", data);
  }
});
