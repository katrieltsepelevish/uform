import Joi from 'joi';

export const formSchema = Joi.object().keys({
	name: Joi.string().required(),
});
