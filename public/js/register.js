/**
 * TODO: 8.3 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

document.getElementById("btnRegister").addEventListener("click", () => {
    const form = document.getElementById("register-form");
    const name = form.getElementById("name").value;
    const email = form.getElementById("email").value;
    const pass = form.getElementById("password").value;
    const passConfirm = form.getElementById("passwordConfirmation").value;

    if (pass !== passConfirm) {
        createNotification("Password and password confirmation not match", 
                            document.getElementById("notifications-container"), false);
        
    }
    else {
        form.reset();
        const user = {
            "name": name,
            "email": email,
            "password": pass
        };
        await postOrPutJSON("http://localhost:3000/api/users", "POST", user);
    }
});