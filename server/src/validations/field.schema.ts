import Joi from 'joi';

export const fieldSchema = Joi.object().keys({
	name: Joi.string().required(),
	label: Joi.string().lowercase().trim().replace(/\s/g, '').required(), // Remove whitespaces
	type: Joi.required().valid('text', 'email', 'tel', 'number', 'date'),
	required: Joi.boolean().required(),
});
