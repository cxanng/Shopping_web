# Group 

Member1:  Duy Anh Vu, duy.a.vu@tuni.fi, H294381, 
resposible for:
- refactoring all files to use FP and follow clean code (except routes.js)
- implementing JWT and fix all tests to test JWT instead of Basic authentication
- implementing users tab
- add login functionality (use JWT)
- migrating "local database" to use data persisted in MongoDB
- managing packages, including prettier plugin for cleaner coding

Member2:  The Anh Nguyen, anh.t.nguyen@tuni.fi, H292126, 
resposible for: 
- Implementing models for user, order, product
- Implementing controller for user, product, order 
- Modifying public HTML files; add addProduct, order HTML files
- Implement view for order, addProduct rendering
- Implement product adding, modifying and deleting
- APIs for products, orders in routes
- Write Product schema related tests


# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS.


### The project structure

```
.
├── index.js                --> Homepage
├── package.json            --> Information about project, including packages and scripts,...
├── routes.js               --> Include routes to handle requests
├── auth                    --> Authorization
│   └──  auth.js            --> Get the current user for authorization
├── controllers             --> Includes methods for API controller
│   ├── orders.js           --> controller for order
│   ├── products.js         --> controller for product
│   └── users.js            --> controller for user
├── models                  --> Schemas for user, order, product
│   ├── orders.js           --> Schema for order
│   ├── products.js         --> Schema for product
│   └── users.js            --> Schema for user
├── public                  --> UIs
│   ├── img                 --> Diagrams
│   ├── js                  --> scripts for UIs
│   └── css                 --> styles of pages
├── utils                   --> include utilities for requests, responses, products, users
│   ├── requestUtils.js     --> utilities related to request
│   ├── responseUtils.js    --> utilities related to response
│   ├── products.js         --> utilities related to products
│   └── Utils.js            --> utilities related to users
└── test                    --> tests
│   ├── auth                --> Authorization test
│   ├── controllers         --> Method tests
│   ├── models              --> User Schema tests
│   ├── utils               --> utilities tests for request and response
└── └── own                 --> Product Schema tests


```

TODO: describe added files here and give them short descriptions
    - HTML, js files related to order, login, add products
    - order and product model files in models folder
    - images of diagrams

## The architecture 
The system follows MVC structure. In this architecture, client's request would go through a router, which would call logics in Controller. Controller would communicate with the Models to get the data to handle the logics. Models communicates with our database, which is MongoDB, to bring data to Controller. Static web page will be sent as HTML via the View to client to render.database.
    ![MVC Diagram](./public/images/MVC.png "MVC diagram")

Ofcourse, the request should be authenticated before and further logics happen. The final system support authentication which allows user to access suitable rights with their roles. Authentication is done using Basic Authentication in master branch, and JWT in "JWT" branch.  
The backend is built following REST api. Some example operations are:
- User
  - Add user (POST)
  - Delete user (DELETE)
  - Modify user (PUT)
  - Get all users (GET)
- Product
  - Add product (admin only) (POST)
  - Delete product (DELETE)
  - Update product (PUT)
  - Get all products (GET)
Below are sequence diagrams of specific actions that each role can get access to:
    ![Admin Sequence Diagram](./public/images/adminProcess.png "Admin sequence diagram")
    ![Customer And Unregistered User Diagram](./public/images/customerSequence.png "Customer and unregistered user")

## Tests and documentation

TODO: Links to at least 10 of your group's GitLab issues, and their associated Mocha tests and test files.

# Additional features
1. Jsonwebtoken (JWT) and login page (branch JWT)  
- We have added a new page for user to login. User must login in order to access other pages. At this time, we are using server-side rendering, so we let the server to handle the permissions regarding accessibilies to pages and functionalities.
- We change the authentication method to JWT. The token, once signed by the server, would be sent back to the client and stored in the localStorage. This way of storing token is quite vulnerable to XSS attacks. More reasons would be discussed further in Security section.

## Security concerns

* Json web token  
Currently, the token is saved in browser's localStorage. This is highly vulnerable as XSS can easily happen due to the fact that the token
is available to all JavaScript. We thought about saving the token to HttpOnly Cookies, but this would require whole reimplementation as well
as tests fixing. In fact, both HttpOnly Cookies and localStorage are vulnerable to XSS attacks in some ways if the web itself does not do
well to prevent such attacks.  
Cookies are safer in a sense that attackers cannot get the token for later uses, but if they can send the request to server, the token is
attached with the request automatically, and this is also harmful for the client. Most importantly, cookies are vulnerable to CSRF attacks.
This can be mitigated using sameSite flag or some sort of anti-CSRF tokens.

TODO: list the security threats represented in the course slides.
Document how your application protects against the threats.
You are also free to add more security threats + protection here, if you will.

