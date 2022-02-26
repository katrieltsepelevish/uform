import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import mongoose from 'mongoose';

import formModel from '../models/form.model';
import fieldModel from '../models/field.model';
import submissionModel from '../models/submission.model';

import { logger } from '../utils/logger.util';
import { prepareSchemaForFields, validate } from '../utils/validator.util';

import { formSchema } from '../validations/form.schema';
import { fieldSchema } from '../validations/field.schema';

class FormController {
	/**
	 * Get all existing forms of user
	 * @param req
	 * @param res
	 * @returns
	 */
	static async getAll(req: Request, res: Response) {
		const forms: any = await formModel
			.find({ userId: req.user._id })
			.populate('fields', '_id name label type required')
			.populate('submissions', '_id values');

		return res.status(HttpStatus.OK).json(forms);
	}

	/**
	 * Get existing form
	 * @param req
	 * @param res
	 * @returns
	 */
	static async get(req: Request, res: Response) {
		const { id } = req.params;

		/* Check if the id is typeof mongodb object id */
		if (!mongoose.Types.ObjectId.isValid(id))
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Form `id` is not correct.' });

		/* Get the form by provided id */
		const form = await formModel
			.findOne({ _id: id, userId: req.user._id })
			.populate('fields', '_id name label type required')
			.populate('submissions', '_id values');

		if (!form)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Form does not exist.' });

		return res.status(HttpStatus.OK).json(form);
	}

	/**
	 * Create new form
	 * @param req
	 * @param res
	 * @returns
	 */
	static async create(req: Request, res: Response) {
		const [error] = validate(req.body, formSchema);

		if (error)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: error.message });

		const { name } = req.body;

		const newForm = await formModel.create({
			name,
			userId: req.user!._id,
		});

		logger.info(`Form ${newForm._id} successfully created.`);

		return res.status(HttpStatus.CREATED).json(newForm);
	}

	/**
	 * Add fields to existing form
	 * @param req
	 * @param res
	 * @returns
	 */
	static async field(req: Request, res: Response) {
		const { id } = req.params;

		/* Check if the id is typeof mongodb object id */
		if (!mongoose.Types.ObjectId.isValid(id))
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Form `id` is not correct.' });

		/* Get the form by provided id */
		const form = await formModel.findOne({ _id: id, userId: req.user._id });

		if (!form)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Form does not exist.' });

		/* Validate the arguments */
		const [error] = validate(req.body, fieldSchema);

		if (error)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: error.message });

		const { name, label, type, required } = req.body;

		const fieldExists = await fieldModel.find({ formId: form._id, label });

		if (fieldExists && fieldExists.length > 0)
			return res.status(HttpStatus.BAD_REQUEST).json({
				message:
					'Field with same label already exists in current form.',
			});

		const newField: any = await fieldModel.create({
			name,
			label,
			type,
			required,
			formId: id,
		});

		await formModel.findByIdAndUpdate(id, {
			$push: { fields: newField },
		});

		logger.info(`Field ${newField._id} added to Form ${id}.`);

		return res.status(HttpStatus.CREATED).json({
			id: newField._id,
			name: newField.name,
			label: newField.label,
			type: newField.type,
			required: newField.required,
		});
	}

	/**
	 * Submit specific form
	 * @param req
	 * @param res
	 * @returns
	 */
	static async submit(req: Request, res: Response) {
		const { id } = req.params;

		/* Check if the id is typeof mongodb object id */
		if (!mongoose.Types.ObjectId.isValid(id))
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Form `id` is not correct.' });

		/* Get the form by provided id */
		const form = await formModel.findOne({ _id: id }).exec();

		if (!form)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Form does not exist.' });

		/* Get form's fields */
		let fields: any = await fieldModel.find({ formId: form._id });

		if (!fields)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Form does not have fields.' });

		const schemaFields = prepareSchemaForFields(fields);

		const [error] = validate(req.body, schemaFields);

		if (error)
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: error.message });

		const newSubmission = await submissionModel.create({
			values: { ...req.body },
			formId: form._id,
		});

		await formModel.findByIdAndUpdate(id, {
			$push: { submissions: newSubmission },
		});

		logger.info(`submission ${newSubmission._id} made to Form ${id}.`);

		return res.status(HttpStatus.OK).json({
			id: newSubmission._id,
			values: newSubmission.values,
			formId: newSubmission.formId,
		});
	}
}

export default {
	get: FormController.get,
	getAll: FormController.getAll,
	create: FormController.create,
	field: FormController.field,
	submit: FormController.submit,
};
