const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Producto = require('./Producto');
const Pedido = require('./Pedido');

const PedidoProducto = sequelize.define('PedidoProducto', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

Producto.belongsToMany(Pedido, { through: PedidoProducto });
Pedido.belongsToMany(Producto, { through: PedidoProducto });

module.exports = PedidoProducto;
