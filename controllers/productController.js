//profe, dejeme desirle que esta parte es la que mas me costo entender, espero este satisfactoriamente bien hecho.


const Product = require('../src/models/product');

exports.createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
      const newProduct = await Product.create({ name, description, price, stock, userId: req.user.id });
      res.redirect('/products/admin/products'); 
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['name', 'ASC']] 
    });

    // Mapea los productos para asegurar que product.price sea un número
    const formattedProducts = products.map(product => {
      const productJSON = product.toJSON();
      return {
        ...productJSON,
        price: parseFloat(productJSON.price) // Asegura que el precio sea un número
      };
    });

    // Decide qué vista renderizar dependiendo del tipo de usuario o ruta
    if (req.path.includes('/admin')) {
      // Renderiza la vista de productos para administrador
      res.render('products', { products: formattedProducts });
    } else {
      // Renderiza la vista de productos para usuario normal
      const successMsg = req.flash('success');
      console.log('Success Message:', successMsg); // Verificar que successMsg tenga un valor

      res.render('user-products', { products: formattedProducts, successMsg });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};




exports.buyProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.status(404).send('Product not found');
    }
    if (product.stock <= 0) {
      req.flash('error', 'Product out of stock');
      return res.status(400).send('Product out of stock');
    }
    // Simular la compra (reducir el stock)
    product.stock -= 1;
    await product.save();

    // Configurar mensaje de éxito
    req.flash('success', 'Compra realizada exitosamente!');

    res.redirect('/products'); // Redirigir a la lista de productos después de la compra
  } catch (error) {
    req.flash('error', 'Error comprando el producto');
    res.status(500).json({ error: 'Error comprando el producto', details: error.message });
  }
};



exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update({ name, description, price, stock });
    res.redirect('/products/admin/products');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.redirect('/products/admin/products');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editProductForm = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.render('edit-product', { product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};