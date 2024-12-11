const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Categoria = sequelize.define(
    'Categoria',
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'Categoria', 
    }
);

module.exports = Categoria;
