const express = require('express');
const userRouter = require('./store.routes');
const productRouter = require('./product.routes');

function configureRoutes(app) {
    const router = express.Router();
    app.use('/', router);
    router.use('/store', userRouter);
    router.use('/products', productRouter);
}

module.exports = configureRoutes;
