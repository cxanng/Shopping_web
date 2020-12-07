setLogInText();

const URL = `${getUrl()}/api/login`;
const formTemplate = document.getElementById("log-in-template");
const loggedInTemplate = document.getElementById("logged-in-template");
const container = document.getElementById("log-in-container");

const renderLoggedIn = () => {
  const templateNode = loggedInTemplate.content.cloneNode(true);
  const info = templateNode.querySelector("div");

  info.querySelector("p").innerText = `Logged in as ${getUser().name}`;
  info.querySelector(".log-out-button").addEventListener("click", e => {
    e.preventDefault();
    window.localStorage.removeItem("logged-in");
    createNotification(
      "Logged out successfully",
      "notifications-container",
      true
    );
    renderForm();
    document.getElementById("log-in-link").innerText = "Log in";
    removeElement("log-in-container", "logged-in-user");
  });
  container.appendChild(info);
};

const renderForm = () => {
  const templateNode = formTemplate.content.cloneNode(true);
  const form = templateNode.querySelector("#log-in-form");
  form.querySelector("#log-in-button").addEventListener("click", async e => {
    e.preventDefault();
    const email = document.querySelector("#email-input").value;
    const password = document.querySelector("#password-input").value;

    const data = { email, password };

    const response = await postOrPutJSON(URL, "POST", data);

    if (!response) {
      return createNotification(
        "Wrong credentials",
        "notifications-container",
        false
      );
    }
    createNotification(
      "Logged in successfully",
      "notifications-container",
      true
    );
    window.localStorage.setItem("logged-in", JSON.stringify(response));
    console.log(response)
    renderLoggedIn();
    document.getElementById("log-in-link").innerText = `User ${response.name}`;
    removeElement("log-in-container", "log-in-form");
  });

  container.appendChild(form);
};

if (getUser()) {
  renderLoggedIn();
} else {
  renderForm();
}
