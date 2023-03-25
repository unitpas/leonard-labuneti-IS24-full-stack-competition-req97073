## Install and run
    npm i 
    npm start

 - Web app running 
    http://localhost:3000
 - Api running
    http://localhost:3000/api/ 
 - Swagger running
    http://localhost:3000/api/api-docs

## API Usage     
API Health endpoint: : GET http://localhost:3000/api/ 

GET all products: GET http://localhost:3000/api/products

GET a product by ID: GET http://localhost:3000/api/products/1

POST a new product: POST http://localhost:3000/api/products with body:

```
{
    "productName": "Product 4",
    "productOwnerName": "Owner 4",
    "Developers": [
      "Developer 7",
      "Developer 8"
    ],
    "scrumMasterName": "Scrum Master 5",
    "startDate": "2023/01/01",
    "methodology": "Scrum"
}
```

DELETE a product by id : DELETE http://localhost:3000//api/products/4

