const express = require('express');
const cartController = require('../controllers/cartController'); 
const router = express.Router();

// Ruta para ver el carrito de compras (GET)
router.get('/shopping-cart', cartController.getCart); 

// Ruta para añadir producto al carrito (POST)
router.post('/add-to-cart', cartController.addToCart); 

// Ruta para la página de checkout (GET)
router.get('/checkout', cartController.checkout);

// Ruta para confirmar el pedido (POST)
router.post('/confirm-order', cartController.confirmOrder);

// Eliminar producto del carrito (POST)
router.post('/remove-from-cart', (req, res) => {
    const { index } = req.body;
    if (req.session.carrito) {
        req.session.carrito.splice(index, 1); // Eliminar el producto por índice
    }
    res.json({ carrito: req.session.carrito });
});

// Actualizar la cantidad de un producto en el carrito (POST)
router.post('/update-cart', (req, res) => {
    const { index, cantidad } = req.body;
    if (req.session.carrito && req.session.carrito[index]) {
        req.session.carrito[index].cantidad = cantidad;
    }
    res.json({ carrito: req.session.carrito });
});

module.exports = router;
