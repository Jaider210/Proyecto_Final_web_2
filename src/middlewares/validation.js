const Joi = require('joi');

exports.validateUser = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(`Error de validación: ${error.message}`);
    }
    next();
};

exports.validateOrder = (req, res, next) => {
    const schema = Joi.object({
        cliente: Joi.string().min(3).required(),
        direccion: Joi.string().min(10).required(),
        telefono: Joi.string().pattern(/^[0-9]{7,10}$/).required(),
        carrito: Joi.array()
            .items(
                Joi.object({
                    id: Joi.number().required(),
                    cantidad: Joi.number().min(1).required(),
                    precio: Joi.number().min(0).required(),
                })
            )
            .required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(`Error de validación: ${error.message}`);
    }
    next();
};
