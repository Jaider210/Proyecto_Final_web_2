// src/controllers/adminController.js
exports.getProducts = (req, res) => {
    res.render('products', { productos: [], categorias: [] }); // Render básico
};
