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
resposible for: Implementing models for user, order, product; controller for user, product, order; modifying public HTML files; add addProduct, order HTML files; implement view for order, addProduct rendering; implement product adding, modifying and deleting; APIs for products, orders in routes.



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
│   ├── models              --> Schema tests
│   ├── utils               --> utilities tests for request and response
└── └── own                 --> TODO


```

TODO: describe added files here and give them short descriptions
    - HTML, js files related to order, login, add products
    - order and product model files in models folder
    - images of diagrams

## The architecture 

TODO: describe the system, important buzzwords include MVC and REST.
UML diagrams would be highly appreciated.

The system follows MVC structure, which means interactions between Model and View must go through Controller.
    ![MVC Diagram](./public/images/MVC.png "MVC diagram")

    The final system support REST api which allow user to access suitable rights with their role
    Below are sequence diagrams of specific actions that each role can get access to:
![Admin Sequence Diagram](./public/images/adminProcess.png "Admin sequence diagram")
![Customer And Unregistered User Diagram](./public/images/customerSequence.png "Customer and unregistered user")

## Tests and documentation

TODO: Links to at least 10 of your group's GitLab issues, and their associated Mocha tests and test files.

## Security concerns

* Json web token
Currently, the token is saved in browser's localStorage. This is highly vulnerable as XSS can easily happen due to the fact that the token
is available to all scripts. We thought about saving the token to HttpOnly Cookies, but this would require whole reimplementation as well
as tests fixing. Therefore, we let the browser to save that token.

TODO: list the security threats represented in the course slides.
Document how your application protects against the threats.
You are also free to add more security threats + protection here, if you will.

