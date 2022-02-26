import Joi from 'joi';

export const validate = (input: any, schema: Joi.Schema) => {
	const { error, value } = schema.validate(input);

	if (error) {
		return [
			{
				field: error.details[0].path[0],
				message: error.details[0].message,
			},
			null,
		];
	}

	return [null, value];
};

export const prepareSchemaForFields = (fields: any) => {
	let baseSchema = Joi.object().keys({});

	fields.forEach((field: any) => {
		switch (field.type) {
			case 'text':
				baseSchema = baseSchema.keys({
					[field.label]: field.required
						? Joi.string().required()
						: Joi.string(),
				});
				break;
			case 'email':
				baseSchema = baseSchema.keys({
					[field.label]: field.required
						? Joi.string().required().email()
						: Joi.string().email(),
				});
				break;
			case 'tel':
				baseSchema = baseSchema.keys({
					[field.label]: field.required
						? Joi.string()
								.pattern(/^[0-9]+$/, 'value must be in digits')
								.length(10)
								.required()
						: Joi.string()
								.pattern(/^[0-9]+$/, 'value must be in digits')
								.length(10),
				});
				break;
			case 'number':
				baseSchema = baseSchema.keys({
					[field.label]: field.required
						? Joi.number().required()
						: Joi.number(),
				});
				break;
			case 'date':
				baseSchema = baseSchema.keys({
					[field.label]: field.required
						? Joi.date().required()
						: Joi.date(),
				});
				break;
		}
	});

	return baseSchema;
};
