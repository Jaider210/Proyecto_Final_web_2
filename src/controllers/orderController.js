const Pedido = require('../models/Pedido');
const PedidoProducto = require('../models/PedidoProducto');
const Producto = require('../models/Producto');
const ExcelJS = require('exceljs');

exports.createOrder = async (req, res) => {
    try {
        const { cliente, direccion, telefono, carrito } = req.body;

        // Crear el pedido
        const nuevoPedido = await Pedido.create({
            cliente,
            direccion,
            telefono,
            total: carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
        });

        // Guardar los productos en el pedido
        for (const item of carrito) {
            await PedidoProducto.create({
                pedidoId: nuevoPedido.id,
                productoId: item.id,
                cantidad: item.cantidad,
                precio: item.precio,
            });
        }

        // Limpiar el carrito y redirigir
        req.session.carrito = [];
        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).send('Error al procesar el pedido.');
    }
};

exports.getOrders = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({ include: { model: Producto } });
        res.render('admin/orders', { pedidos });
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).send('Error al cargar pedidos.');
    }
};

// Exportar pedido
exports.exportOrders = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({ include: Producto });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pedidos');

        worksheet.columns = [
            { header: 'ID Pedido', key: 'id', width: 10 },
            { header: 'Cliente', key: 'cliente', width: 20 },
            { header: 'Dirección', key: 'direccion', width: 30 },
            { header: 'Teléfono', key: 'telefono', width: 15 },
            { header: 'Total', key: 'total', width: 10 },
        ];

        pedidos.forEach(pedido => {
            worksheet.addRow({
                id: pedido.id,
                cliente: pedido.cliente,
                direccion: pedido.direccion,
                telefono: pedido.telefono,
                total: pedido.total,
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=pedidos.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error al exportar pedidos:', err);
        res.status(500).send('Error al exportar pedidos.');
    }
};