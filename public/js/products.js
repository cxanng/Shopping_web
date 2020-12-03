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

        const addToCart = itemRow.querySelector(".add-to-cart-button");
        addToCart.setAttribute("id", `add-to-cart-${id}`);
        addToCart.innerText = "Add to cart";
        addToCart.addEventListener("click", () => addProduct(product));

        const modifyItem = itemRow.querySelector(".modify-product-button");
        modifyItem.setAttribute("id", `modify-${id}`);
        modifyItem.addEventListener("click", () => modifyHandle(id));

        const deleteItem = itemRow.querySelector(".delete-product-button");
        deleteItem.setAttribute("id", `delete-${id}`);
        deleteItem.addEventListener("click", () =>deleteHandle(id));

        container.appendChild(itemRow);
    });
}

const addProduct = ({ _id, name }) => {
    addProductToCart(_id);
    createNotification(`Added ${name} to cart!`, "notifications-container");
}
const productLoad = async () => {
    const products = await getJSON(URL);
    renderProduct(products);
}

const deleteHandle = async (id) => {
    const url = "api/products/" + id;
    deleteResource(url).then(response => {
        if(response) {
            createNotification("Deleted product "+ response.name, "notifications-container", true);
            container.querySelectorAll(`#product-${id}`).forEach(element => element.remove());
            document.getElementById("modify-product").querySelectorAll("edit-product-form").forEach(element => element.remove());
        }
    })
}

const modifyHandle = async (id) => {
    const url = "api/products/" + id;
    const productInfo = await getJSON(url);
    const template = document.getElementById("form-template");
    const modifyContainer = document.getElementById("modify-product");

    const cloneDiv = template.content.cloneNode(true);

    const heading = cloneDiv.querySelector("h3")
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

    document.getElementById("update-button").addEventListener('click', (e)=> {
        e.preventDefault();
        if (!image.value.match(/^(http|https):\/\/\S+\.\w{2,}\/*\S*$/)){
            createNotification("Provide correct Url", "notifications-container", false);
        }
        else{            
        const data = { ...productInfo,
            name:name.value,
            description:description.value,
            image:image.value,
            price:Number(price.value) 
        };
        postOrPutJSON(url,"PUT",data).then(response => {
            if(response){
                createNotification(`Updated product ${response.name}`, "notifications-container", true);
                document.getElementById(`name-${response._id}`).textContent= response.name;
                document.getElementById(`description-${response._id}`).textContent= response.description;
                document.getElementById(`price-${response._id}`).textContent= response.price;
                document.getElementById(`image-${response._id}`).setAttribute("src",response.image);
                document.getElementById("modify-product").querySelectorAll("edit-product-form").forEach(element => element.remove());
            }
        });
        }
    })
}
productLoad();