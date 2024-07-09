const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAuthenticated, redirectBasedOnRole } = require('../middleware/authMiddleware');
const Product = require('../src/models/product');


// Ruta para redirigir según el rol después del inicio de sesión
router.get('/redirect', ensureAuthenticated, redirectBasedOnRole);
router.get('/admin/products',ensureAuthenticated, productController.getProducts);

// Rutas para productos
router.get('/', ensureAuthenticated, productController.getProducts);
router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('create-product', { title: 'Create Product' });
});

// ruta para editar productos
router.get('/edit/:id', ensureAuthenticated, productController.editProductForm);
router.post('/edit/:id', ensureAuthenticated, productController.updateProduct);

router.post('/', ensureAuthenticated, productController.createProduct);
router.put('/:id', ensureAuthenticated, productController.updateProduct);
router.delete('/:id', ensureAuthenticated, productController.deleteProduct);
router.get('/user-products', ensureAuthenticated, async (req, res) => {
    try {
        const products = await Product.findAll();
        const successMsg = req.flash('success'); // Asegúrate de obtener el mensaje de éxito aquí
        console.log('Success Message:', successMsg); // Verificar que successMsg tenga un valor
        res.render('user-products', { title: 'User Products', products, successMsg });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// product.routes.js
router.post('/:id/buy', ensureAuthenticated, productController.buyProduct);


module.exports = router;
