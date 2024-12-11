// src/middleware/auth.js
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { // Si Passport está configurado
        return next();
    }
    if (req.session && req.session.user) { // Si usas sesiones básicas
        return next();
    }
    req.flash('error', 'Debes iniciar sesión para acceder a esta página');
    res.redirect('/login');
};

