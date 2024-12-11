const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Categoria = require('./Categoria');

const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
});

// Relación: Un producto pertenece a una categoría
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });

module.exports = Producto;
