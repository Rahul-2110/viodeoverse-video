const Joi = require('joi');

const shareVideoSchema = Joi.object({
   video: Joi.number().required(),
   ttl: Joi.number().min(1)
});



module.exports = {
    shareVideoSchema,
}