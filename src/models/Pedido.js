const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pedido = sequelize.define('Pedido', {
    cliente: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
}, {
    timestamps: true,
});

module.exports = Pedido;
