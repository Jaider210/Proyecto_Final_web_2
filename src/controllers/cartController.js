const Producto = require('../models/Producto');
// Confirmar el pedido y guardarlo en la base de datos
const Pedido = require('../models/Pedido'); // Importa el modelo de Pedido

// Función para obtener el carrito
exports.getCart = (req, res) => {
    const carrito = req.session.carrito || [];  // Asegúrate de que el carrito esté en la sesión
    res.render('shopping-cart', { carrito });
};


exports.addToCart = async (req, res) => {
    const { productoId, cantidad } = req.body;

    try {
        const producto = await Producto.findByPk(productoId);

        if (producto) {
            // Recuperamos el carrito de la sesión
            let carrito = req.session.carrito || [];
            let item = carrito.find(item => item.id === producto.id);

            if (item) {
                item.cantidad += parseInt(cantidad); // Si ya está en el carrito, aumenta la cantidad
            } else {
                carrito.push({ ...producto.dataValues, cantidad: parseInt(cantidad) }); // Agregar el producto al carrito
            }

            // Guardamos el carrito actualizado en la sesión
            req.session.carrito = carrito;

            // Devolvemos la respuesta con el carrito actualizado, el producto y el total
            return res.json({
                producto: producto.dataValues, // Enviar el producto agregado
                carrito: carrito, // El carrito actualizado
                total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) // Total actualizado
            });
        } else {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        return res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
};


// Función para ir al checkout
exports.checkout = (req, res) => {
    try {
        res.render('checkout');
    } catch (error) {
        console.error('Error al cargar la vista de checkout:', error);
        res.status(500).send('Error al cargar la vista de checkout');
    }
};


exports.confirmOrder = async (req, res) => {
    try {
        const { cliente, direccion, telefono } = req.body;
        const carrito = req.session.carrito || [];

        if (!carrito.length) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        // Crear el pedido en la base de datos
        const pedido = await Pedido.create({
            cliente,
            direccion,
            telefono,
            total,
        });

        // Limpia el carrito después de confirmar el pedido
        req.session.carrito = [];

        // Devuelve una respuesta con el pedido confirmado
        res.json({ message: 'Pedido confirmado', pedido });
    } catch (error) {
        console.error('Error al confirmar el pedido:', error);
        res.status(500).json({ error: 'Error al confirmar el pedido' });
    }
};

