setLogInText();

// TODO: handle 2 things
// 1. Not yet logged in user cannot see the form, but a message instead
// 2. Only admin can see the form, for customer, a message say no permission!

document.getElementById("btnAddProduct").addEventListener("click", async e => {
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
    await postOrPutJSON(`${getUrl()}/api/products`, "POST", data);
  }
});
