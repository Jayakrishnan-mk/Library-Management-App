const Joi = require('joi');

const borrowBookSchema = Joi.object({
    bookId: Joi.string().required(),
});

module.exports = {
    borrowBookSchema,
};
