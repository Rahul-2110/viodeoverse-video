const Joi = require('joi');

const trimVideoSchema = Joi.object({
    start: Joi.number().min(0).required(),
    end: Joi.number().min(0).greater(Joi.ref('start')).optional(),
});

const mergegeVideoSchema = Joi.object({
    videos: Joi.array().items(Joi.number()).min(2).required(),
});

module.exports = {
    trimVideoSchema,
    mergegeVideoSchema
}