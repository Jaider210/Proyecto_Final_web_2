const express = require('express');
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const cartController = require('../controllers/cartController'); 
const router = express.Router();

// Mostrar productos agrupados por categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            include: Producto,
        });

        const usuario = req.session.user || null; // Usuario autenticado
        const carrito = req.session.carrito || []; // Carrito de la sesión

        res.render('index', { categorias, usuario, carrito }); // Pasar carrito a la vista
    } catch (err) {
        console.error('Error al cargar categorías y productos:', err);
        res.status(500).send('Error al cargar la página principal');
    }
});



// Añadir un producto al carrito (Usa el controlador existente)
router.post('/add-to-cart', cartController.addToCart); 

router.get('/category/:id', async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id, {
            include: Producto,
        });
        if (!categoria) {
            return res.status(404).send('Categoría no encontrada');
        }
        res.render('category', { categoria });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/', (req, res) => {
    const usuario = req.session.user || null; // Suponiendo que la sesión almacena la información del usuario
    res.render('index', { usuario, categorias }); // Pasa las categorías y el usuario a la vista
});


module.exports = router;
