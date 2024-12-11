const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const { validateUser } = require('../middlewares/validation');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login', { messages: req.flash('error') });
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/', // Redirige a la página principal después de iniciar sesión
        failureRedirect: '/login', // Redirige a la página de inicio de sesión en caso de error
        failureFlash: true, // Muestra mensajes de error en caso de fallo
    }),
    (req, res) => {
        // Almacena datos en la sesión después de una autenticación exitosa
        req.session.user = {
            id: req.user.id,
            nombre: req.user.nombre,
            email: req.user.email,
        };
    }
);

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', validateUser, async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Usuario.create({ email, password: hashedPassword, rol: 'admin' });
    res.redirect('/login');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// router.post(
//     '/login',
//     passport.authenticate('local', {
//         failureRedirect: '/login',
//         failureFlash: true,
//     }),
//     (req, res) => {
//         req.session.user = {
//             id: req.user.id,
//             nombre: req.user.nombre,
//             email: req.user.email,
//         };
//         res.redirect('/'); // Redirige al inicio después de iniciar sesión
//     }
// );


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/'); // Redirigir al inicio en caso de error
        }
        res.redirect('/login'); // Redirigir a la página de inicio de sesión
    });
});


module.exports = router;
