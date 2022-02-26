import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import { get, submitForm } from '../app/thunks/form.thunk';

type Props = {
	form: any;
	getForm: Function;
	submitForm: Function;
};

const ViewFormPage: FC<Props> = ({ form, getForm, submitForm }) => {
	const [isInitiallyMounted, setIsInitiallyMounted] = useState(false);
	const [success, setSuccess] = useState(false);

	const { id } = useParams();

	const prepareSchemaForFields = (fields: any) => {
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
									.pattern(
										/^[0-9]+$/,
										'value must be in digits',
									)
									.length(10)
									.required()
							: Joi.string()
									.pattern(
										/^[0-9]+$/,
										'value must be in digits',
									)
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

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: joiResolver(prepareSchemaForFields(form.fields)),
	});

	useEffect(() => {
		(async () => {
			await getForm(id);

			setIsInitiallyMounted(true);
		})();
	}, []);

	if (!isInitiallyMounted) {
		return <div>Loading...</div>;
	}

	// Redirect if form doesn't exist or doesn't have fields
	if (!form._id || !form.fields) return <Navigate to='/' replace />;

	const renderFields = (fields: any) => {
		return fields.map((field: any, index: any) => {
			return (
				<div key={index} className='mb-4'>
					<label className='block text-gray-700 text-sm font-bold mb-2'>
						{field.name}
					</label>
					<input
						className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						type='text'
						{...register(field.label)}
					/>
					{errors[field.label] && (
						<span className='text-xs tracking-wide text-red-600'>
							{errors[field.label].message}
						</span>
					)}
				</div>
			);
		});
	};

	return (
		<div className='flex flex-col items-center min-h-screen bg-gray-100'>
			<div className='block p-4 text-left w-full'>
				<div className='block'>
					<form noValidate>
						{renderFields(form.fields)}
						<button
							type='submit'
							className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:bg-gray-600'
							disabled={success}
							onClick={handleSubmit(async (formData: any) => {
								const submit = await submitForm(
									{ ...formData },
									form._id,
								);

								if (submit.id) {
									setSuccess(true);
									reset(); // Reset form values
								}
							})}
						>
							{success ? 'Submitted' : 'Submit'}
						</button>
						{form.error && (
							<span className='text-xs tracking-wide text-red-600 mt-4 block'>
								{form.error.message}
							</span>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	form: state.form,
});

const mapDispatchToProps = (dispatch: any) => ({
	getForm: (id: any) => dispatch(get(id)),
	submitForm: (formData: any, formId: any) =>
		dispatch(submitForm(formData, formId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewFormPage);
