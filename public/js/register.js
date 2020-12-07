/**
 * TODO: 8.3 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

document.getElementById("btnRegister").addEventListener("click", e => {
  e.preventDefault();
  const form = document.getElementById("register-form");
  const name = form.querySelector("#name").value;
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;
  const passwordConfirm = form.querySelector("#passwordConfirmation").value;

  if (password !== passwordConfirm) {
    createNotification(
      "Password and password confirmation not match",
      "notifications-container",
      false
    );
  } else {
    form.reset();
    createNotification(
      `User ${name} registered`,
      "notifications-container",
      true
    );
    const user = { name, email, password };
    postOrPutJSON(`${getUrl()}/api/register`, "POST", user);
  }
});
