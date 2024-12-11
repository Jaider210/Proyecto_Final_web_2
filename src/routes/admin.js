const express = require('express');
const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');
const orderController = require('../controllers/orderController');
const router = express.Router();

// CRUD de Categorías
// Ruta para listar categorías
router.get('/categories', async (req, res) => {
    try {
        const categorias = await Categoria.findAll(); // Consulta las categorías
        res.render('admin/categories', { categorias }); // Renderiza la vista
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        res.status(500).send('Error al cargar categorías');
    }
});

// Ruta para agregar una categoría
router.post('/categories', async (req, res) => {
    try {
        const { nombre } = req.body;
        await Categoria.create({ nombre });
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error al agregar categoría:', error);
        res.status(500).send('Error al agregar categoría');
    }
});

//eliminar categorias
router.post('/categories/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Categoria.destroy({ where: { id } });
    res.redirect('/admin/products');
});

// CRUD de Productos
router.get('/products', async (req, res) => {
    try {
        const productos = await Producto.findAll({ include: Categoria }); // Incluye las categorías
        const categorias = await Categoria.findAll(); // Obtén las categorías para el formulario
        res.render('admin/products', { productos, categorias }); // Pasa los datos a la vista
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).send('Error al cargar productos');
    }
});

router.post('/products', async (req, res) => {
    const { nombre, descripcion, precio, categoriaId, imagen } = req.body;

    try {
        await Producto.create({ nombre, descripcion, precio, categoriaId, imagen });
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).send('Error al agregar producto');
    }
});


router.post('/products/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        // Eliminar producto
        await producto.destroy();
        res.redirect('/admin/products'); // Redirigir a la página de productos
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error al eliminar producto');
    }
});

router.get('/products/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('admin/editProduct', { producto });
    } catch (error) {
        console.error('Error al cargar producto para editar:', error);
        res.status(500).send('Error al cargar producto');
    }
});

// Ruta para actualizar un producto
router.post('/products/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen } = req.body;

    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        // Actualiza el producto con los nuevos datos
        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.imagen = imagen || null; // Si no se proporciona imagen, se establece como null

        await producto.save(); // Guarda los cambios en la base de datos

        res.redirect('/admin/products'); // Redirige a la lista de productos
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
});

// Ruta para ver los pedidos
router.get('/orders', orderController.getOrders);


module.exports = router;
