const express = require('express');
const sequelize = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuración de la sesión
app.use(session({
    secret: process.env.SECRET_KEY || '123456789',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Middleware para inicializar `req.session.carrito`
app.use((req, res, next) => {
    if (!req.session.carrito) {
        req.session.carrito = []; // Inicializa un carrito vacío
    }
    next();
});

// Middleware para inyectar datos de sesión en las vistas
app.use((req, res, next) => {
    res.locals.usuario = req.session.user || null; // Asegúrate de que req.session.user esté configurado al iniciar sesión
    next();
});

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de flash messages
app.use(flash());

// Middleware para parsear JSON y datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

app.use('/', productRoutes);
app.use('/admin', adminRoutes);
app.use('/', cartRoutes);
app.use('/', authRoutes);
app.use('/orders', orderRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
