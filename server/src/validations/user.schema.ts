import Joi from 'joi';

export const userSchema = Joi.object().keys({
	name: Joi.string().allow(''),
	email: Joi.string().required().email(),
	password: Joi.string().required(),
});
