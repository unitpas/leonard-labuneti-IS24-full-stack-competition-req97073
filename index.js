const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const swagger = require('./swagger/swagger');
const Joi = require('joi');
const products = require('./data');

const productSchema = Joi.object({
    productId: Joi.number().required(),
    productName: Joi.string().required(),
    productOwnerName: Joi.string().required(),
    Developers: Joi.array().items(Joi.string()).required(),
    scrumMasterName: Joi.string().required(),
    startDate: Joi.date().required(),
    methodology: Joi.string().required(),
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Mount the Swagger middleware on /docs endpoint
app.use('/api/api-docs', swagger);

// GET health endpoint
app.get('/api', (req, res) => {
    const status = {
        status: 'UP',
        version: '1.1.0',
        uptime: process.uptime(),
        hostname: os.hostname(),
    };
    res.json(status);
});

// GET all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// GET a product by ID
app.get('/api/products/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const product = products.find(product => product.productId === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if(product.Developers.length > 5){
        return res.status(404).json({ message: 'Up to 5 developers allowed' });
    }

    res.json(product);
});

// POST a new product
app.post('/api/products', (req, res) => {
    const product = req.body;
    product.productId = products.length + 1;

    const { error } = productSchema.validate(product);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    products.push(product);
    res.json(product);
});

// PUT (update) an existing product
app.put('/api/products/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const productIndex = products.findIndex(product => product.productId === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = { ...products[productIndex], ...req.body };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});

// DELETE a product
app.delete('/api/products/:productId', (req, res) => {
    const productId = Number(req.params.productId);
    const productIndex = products.findIndex(product => product.productId === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    res.json(deletedProduct);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
