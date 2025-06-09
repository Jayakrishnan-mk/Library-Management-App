const Joi = require('joi');

const createBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().allow(''),
    totalCopies: Joi.number().integer().min(1).required(),
});

const updateBookSchema = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    description: Joi.string().allow(''),
    totalCopies: Joi.number().integer().min(1),
});

module.exports = {
    createBookSchema,
    updateBookSchema,
};
