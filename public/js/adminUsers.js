/**
 * TODO: 8.3 List all users (use <template id="user-template"> in users.html)
 *       - Each user should be put inside a clone of the template fragment
 *       - Each individual user HTML should look like this
 *         (notice the id attributes and values, replace "{userId}" with the actual user id)
 *
 *         <div class="item-row" id="user-{userId}">
 *           <h3 class="user-name" id="name-{userId}">Admin</h3>
 *           <p class="user-email" id="email-{userId}">admin@email.com</p>
 *           <p class="user-role" id="role-{userId}">admin</p>
 *           <button class="modify-button" id="modify-{userId}">Modify</button>
 *           <button class="delete-button" id="delete-{userId}">Delete</button>
 *         </div>
 *
 *       - Each cloned template fragment should be appended to <div id="users-container">
 *       - Use getJSON() function from utils.js to fetch user data from server
 *
 * TODO: 8.5 Updating/modifying and deleting existing users
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 *       - Use deleteResource() function from utils.js to delete users from server
 *       - Clicking "Delete" button of a user will delete the user and update the listing accordingly
 *       - Clicking "Modify" button of a user will use <template id="form-template"> to
 *         show an editing form populated with the values of the selected user
 *       - The edit form should appear inside <div id="modify-user">
 *       - Afted successful edit of user the form should be removed and the listing updated accordingly
 *       - You can use removeElement() from utils.js to remove the form.
 *       - Remove edit form from the DOM after successful edit or replace it with a new form when another
 *         user's "Modify" button is clicked. There should never be more than one form visible at any time.
 *         (Notice that the edit form has an id "edit-user-form" which should be unique in the DOM at all times.)
 *       - Also remove the edit form when a user is deleted regardless of which user is deleted.
 *       - Modifying a user successfully should show a notification message "Updated user {User Name}"
 *       - Deleting a user successfully should show a notification message "Deleted user {User Name}"
 *       - Use createNotification() function from utils.js to create notifications
 */

const template = document.getElementById("user-template");
const container = document.getElementById("users-container");
const idTemplate = ["user", "name", "email", "role", "modify"];

getJSON("http://localhost:3000/api/users").then(people => {
  people.forEach(person => {
    const id = person._id;
    const newPerson = template.content.cloneNode(true);

    const itemRow = newPerson.querySelector("div");
    itemRow.setAttribute("id", `user-${id}`);

    const name = itemRow.querySelector("h3");
    name.setAttribute("id", `name-${id}`);
    name.innerText = person.name;

    const email = itemRow.querySelector(".user-email");
    email.setAttribute("id", `email-${id}`);
    email.innerText = person.email;

    const role = itemRow.querySelector(".user-role");
    role.setAttribute("id", `role-${id}`);
    role.innerText = person.role;

    const modifyBtn = itemRow.querySelector(".modify-button");
    modifyBtn.setAttribute("id", `modify-${id}`);

    const deleteBtn = itemRow.querySelector(".delete-button");
    deleteBtn.setAttribute("id", `delete-${id}`);

    container.appendChild(itemRow);
  });
});
