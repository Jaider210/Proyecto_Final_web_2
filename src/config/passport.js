const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuario.findOne({ where: { email } });
                if (!usuario) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
                const isMatch = await bcrypt.compare(password, usuario.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }
                return done(null, usuario);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findByPk(id);
        done(null, usuario);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
