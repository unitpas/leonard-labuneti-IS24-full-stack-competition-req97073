const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const openApiDoc = require('./openApi.json');

// Serve the Swagger documentation
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(openApiDoc));

module.exports = router;
